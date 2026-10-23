import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ELECTION_METADATA, 
  CANDIDATES, 
  REFERENDUMS, 
  INITIAL_REGISTERED_VOTERS 
} from '../utils/mockData';
import { 
  hashSync, 
  generateNullifier, 
  encryptBallot, 
  MerkleTree, 
  generateVoterReceipt 
} from '../utils/crypto';

const ElectionContext = createContext();

export function ElectionProvider({ children }) {
  // Persistence key
  const STORAGE_KEY = 'VOTESHIELD_ELECTION_STATE_V1';

  // State variables
  const [voters, setVoters] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_VOTERS`);
      return saved ? JSON.parse(saved) : INITIAL_REGISTERED_VOTERS;
    } catch {
      return INITIAL_REGISTERED_VOTERS;
    }
  });

  const [ballots, setBallots] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_BALLOTS`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [spentNullifiers, setSpentNullifiers] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_NULLIFIERS`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [officialRoot, setOfficialRoot] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_OFFICIAL_ROOT`);
      return saved || hashSync('VOTESHIELD_EMPTY_ROOT');
    } catch {
      return hashSync('VOTESHIELD_EMPTY_ROOT');
    }
  });

  const [tallyCeremonyConducted, setTallyCeremonyConducted] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TALLY_CONCLUDED`);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [lastReceipt, setLastReceipt] = useState(null);
  const [auditLog, setAuditLog] = useState([
    {
      id: 'log-0',
      timestamp: new Date().toISOString(),
      level: 'INFO',
      source: 'CRYPTO_INIT',
      message: `VoteShield Genesis initialized. Election ID: ${ELECTION_METADATA.electionId}. WebCrypto Offline Engine ready.`
    }
  ]);

  // Derived Merkle Tree from current ballots
  const leafHashes = ballots.map(b => b.leafHash);
  const currentMerkleTree = new MerkleTree(leafHashes);
  const currentCalculatedRoot = currentMerkleTree.getRoot();

  // Ledger integrity status: matches official published root?
  const isLedgerCompromised = ballots.length > 0 && currentCalculatedRoot !== officialRoot;

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_VOTERS`, JSON.stringify(voters));
      localStorage.setItem(`${STORAGE_KEY}_BALLOTS`, JSON.stringify(ballots));
      localStorage.setItem(`${STORAGE_KEY}_NULLIFIERS`, JSON.stringify(spentNullifiers));
      localStorage.setItem(`${STORAGE_KEY}_OFFICIAL_ROOT`, officialRoot);
      localStorage.setItem(`${STORAGE_KEY}_TALLY_CONCLUDED`, tallyCeremonyConducted.toString());
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [voters, ballots, spentNullifiers, officialRoot, tallyCeremonyConducted]);

  // Add system audit log
  const logEvent = (level, source, message) => {
    setAuditLog(prev => [
      {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: new Date().toISOString(),
        level,
        source,
        message
      },
      ...prev.slice(0, 49) // Keep last 50 logs
    ]);
  };

  /**
   * Cast a verifiable ballot
   */
  const castBallot = async ({ voter, candidateId, referendumChoice }) => {
    const nullifier = generateNullifier(voter.secretKey, ELECTION_METADATA.electionSalt);

    // 1. Verify Duplicate Vote Prevention (Nullifier Check)
    if (spentNullifiers[nullifier]) {
      logEvent('SECURITY_ALERT', 'NULLIFIER_REGISTRY', 
        `Double-voting attempt blocked! Nullifier ${nullifier.substring(0, 16)}... was already spent at ${spentNullifiers[nullifier].timestamp}.`);
      return {
        success: false,
        error: 'DUPLICATE_VOTE_DETECTED',
        message: 'This voter has already cast a ballot in this election! The cryptographic nullifier is marked as spent in the registry.',
        nullifier
      };
    }

    // 2. Client-side Envelope Encryption
    const { envelope, rawCiphertext } = encryptBallot({
      candidateId,
      referendumChoice,
      timestamp: Date.now()
    }, ELECTION_METADATA.publicKey);

    // 3. Merkle Leaf Computation
    const timestamp = Date.now();
    const trackerId = `TRK-${hashSync(voter.secretKey + timestamp).substring(0, 12).toUpperCase()}`;
    const leafPayload = `${nullifier}::${rawCiphertext}::${timestamp}`;
    const leafHash = hashSync(leafPayload);

    // 4. Update Ballot List
    const newBallot = {
      id: `ballot-${Date.now()}`,
      trackerId,
      nullifier,
      encryptedEnvelope: envelope,
      rawCiphertext,
      leafHash,
      candidateId, // Decrypted at official tally
      referendumChoice,
      timestamp,
      tampered: false,
      originalCandidateId: candidateId,
      voterSecretHashPrefix: hashSync(voter.secretKey).substring(0, 8)
    };

    const updatedBallots = [...ballots, newBallot];
    const newLeaves = updatedBallots.map(b => b.leafHash);
    const newTree = new MerkleTree(newLeaves);
    const newRoot = newTree.getRoot();

    // 5. Update Official Published Root (in normal operation)
    setOfficialRoot(newRoot);
    setBallots(updatedBallots);

    // 6. Record Nullifier in Nullifier Registry
    setSpentNullifiers(prev => ({
      ...prev,
      [nullifier]: {
        trackerId,
        timestamp: new Date().toISOString()
      }
    }));

    // 7. Mark voter as voted in the electoral directory
    setVoters(prev => prev.map(v => v.id === voter.id ? { ...v, hasVoted: true } : v));

    // 8. Generate Voter Audit Receipt
    const leafIndex = updatedBallots.length - 1;
    const proof = newTree.getProof(leafIndex);
    const receipt = generateVoterReceipt({
      trackerId,
      nullifier,
      leafHash,
      merkleRoot: newRoot,
      leafIndex,
      proof,
      timestamp
    });

    setLastReceipt(receipt);

    logEvent('SUCCESS', 'BALLOT_COMMITTED', 
      `Ballot ${trackerId} committed to Merkle Leaf #${leafIndex}. Root: ${newRoot.substring(0, 12)}... Nullifier logged.`);

    return {
      success: true,
      receipt,
      trackerId,
      nullifier,
      merkleRoot: newRoot
    };
  };

  /**
   * Tamper with a ballot in the ledger (Instructor/Student Adversarial Lab)
   */
  const tamperBallot = (ballotIndex, fakeCandidateId) => {
    if (ballotIndex < 0 || ballotIndex >= ballots.length) return;

    setBallots(prev => {
      const next = [...prev];
      const target = { ...next[ballotIndex] };
      const previousCand = target.candidateId;
      target.candidateId = fakeCandidateId;
      target.tampered = true;

      // Recalculate forged leaf hash
      const fakeCiphertext = JSON.stringify({
        ...target.encryptedEnvelope,
        ciphertext: `TAMPERED_FORGED_CIPHER_${Date.now()}`
      });
      target.rawCiphertext = fakeCiphertext;
      target.leafHash = hashSync(`${target.nullifier}::${fakeCiphertext}::${target.timestamp}`);
      next[ballotIndex] = target;
      return next;
    });

    logEvent('CRITICAL_ALERT', 'TAMPER_INJECTION', 
      `Adversarial modification: Leaf #${ballotIndex} tampered from candidate choice. Merkle integrity check will now trigger alert!`);
  };

  /**
   * Restore a tampered ballot back to authentic state
   */
  const restoreBallot = (ballotIndex) => {
    if (ballotIndex < 0 || ballotIndex >= ballots.length) return;

    setBallots(prev => {
      const next = [...prev];
      const target = { ...next[ballotIndex] };
      target.candidateId = target.originalCandidateId;
      target.tampered = false;

      // Restore original leaf payload
      const restoredCipher = JSON.stringify(target.encryptedEnvelope);
      target.rawCiphertext = restoredCipher;
      target.leafHash = hashSync(`${target.nullifier}::${restoredCipher}::${target.timestamp}`);
      next[ballotIndex] = target;
      return next;
    });

    logEvent('INFO', 'LEDGER_RESTORE', `Leaf #${ballotIndex} restored to original authentic cryptographic payload.`);
  };

  /**
   * Conduct official election tally ceremony
   */
  const conductTallyCeremony = () => {
    setTallyCeremonyConducted(true);
    logEvent('AUDIT_EVENT', 'TALLY_CEREMONY', 
      `Official tally ceremony completed. All ${ballots.length} cryptographic ballots aggregated and verified against Merkle Root.`);
  };

  /**
   * Batch simulate random student votes to populate the election ledger
   */
  const batchSimulateVotes = async (count = 10) => {
    const unvoted = voters.filter(v => !v.hasVoted);
    const toSimulate = unvoted.slice(0, count);

    if (toSimulate.length === 0) {
      logEvent('WARNING', 'SIMULATION', 'No unvoted students remaining in electoral directory. Add custom voters or reset simulation.');
      return;
    }

    let updatedBallots = [...ballots];
    let updatedSpent = { ...spentNullifiers };
    let votedIds = new Set();

    for (const voter of toSimulate) {
      const randomCand = CANDIDATES[Math.floor(Math.random() * CANDIDATES.length)];
      const randomRef = Math.random() > 0.3 ? 'yes' : 'no';
      const nullifier = generateNullifier(voter.secretKey, ELECTION_METADATA.electionSalt);
      const timestamp = Date.now() - Math.floor(Math.random() * 3600000);

      const { envelope, rawCiphertext } = encryptBallot({
        candidateId: randomCand.id,
        referendumChoice: randomRef,
        timestamp
      }, ELECTION_METADATA.publicKey);

      const trackerId = `TRK-${hashSync(voter.secretKey + timestamp).substring(0, 12).toUpperCase()}`;
      const leafHash = hashSync(`${nullifier}::${rawCiphertext}::${timestamp}`);

      updatedBallots.push({
        id: `ballot-${timestamp}-${Math.random().toString(36).substr(2, 4)}`,
        trackerId,
        nullifier,
        encryptedEnvelope: envelope,
        rawCiphertext,
        leafHash,
        candidateId: randomCand.id,
        referendumChoice: randomRef,
        timestamp,
        tampered: false,
        originalCandidateId: randomCand.id,
        voterSecretHashPrefix: hashSync(voter.secretKey).substring(0, 8)
      });

      updatedSpent[nullifier] = {
        trackerId,
        timestamp: new Date(timestamp).toISOString()
      };

      votedIds.add(voter.id);
    }

    const newLeaves = updatedBallots.map(b => b.leafHash);
    const newTree = new MerkleTree(newLeaves);
    const newRoot = newTree.getRoot();

    setBallots(updatedBallots);
    setSpentNullifiers(updatedSpent);
    setOfficialRoot(newRoot);
    setVoters(prev => prev.map(v => votedIds.has(v.id) ? { ...v, hasVoted: true } : v));

    logEvent('SUCCESS', 'BATCH_SIMULATION', 
      `Successfully batch-simulated ${toSimulate.length} student votes. Merkle Root updated to ${newRoot.substring(0, 14)}...`);
  };

  /**
   * Add a custom voter to the electoral roll
   */
  const addCustomVoter = (newVoter) => {
    const voterId = `VTR-${Math.floor(1000 + Math.random() * 9000)}`;
    const studentId = `ENG-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const secretKey = `VOTER_SEC_KEY_${newVoter.name.toUpperCase().replace(/\s+/g, '_')}_${Math.floor(10000 + Math.random() * 90000)}`;
    
    const formatted = {
      id: voterId,
      studentId: newVoter.studentId || studentId,
      name: newVoter.name,
      department: newVoter.department || 'Computer Science & Engineering',
      secretKey,
      biometricVector: [0.5, -0.2, 0.8, -0.4, 0.3, 0.7, -0.6, 0.1],
      hasVoted: false,
      avatar: newVoter.avatar || '🧑‍🎓',
      livenessBaseline: {
        blinkRatePerMin: 18,
        depthVariance: 0.9,
        skinTextureScore: 0.95
      }
    };

    setVoters(prev => [formatted, ...prev]);
    logEvent('INFO', 'VOTER_ENROLLMENT', `New student voter enrolled: ${formatted.name} (${formatted.studentId}). Secret key generated.`);
    return formatted;
  };

  /**
   * Reset simulation state back to factory demo defaults
   */
  const resetElection = () => {
    localStorage.removeItem(`${STORAGE_KEY}_VOTERS`);
    localStorage.removeItem(`${STORAGE_KEY}_BALLOTS`);
    localStorage.removeItem(`${STORAGE_KEY}_NULLIFIERS`);
    localStorage.removeItem(`${STORAGE_KEY}_OFFICIAL_ROOT`);
    localStorage.removeItem(`${STORAGE_KEY}_TALLY_CONCLUDED`);

    setVoters(INITIAL_REGISTERED_VOTERS);
    setBallots([]);
    setSpentNullifiers({});
    setOfficialRoot(hashSync('VOTESHIELD_EMPTY_ROOT'));
    setTallyCeremonyConducted(false);
    setLastReceipt(null);
    logEvent('WARNING', 'SIMULATOR_RESET', 'All election ballots, nullifiers, and receipts cleared. Re-initialized to factory state.');
  };

  // Calculate live results
  const calculateResults = () => {
    const candidateCounts = {};
    CANDIDATES.forEach(c => { candidateCounts[c.id] = 0; });

    const referendumCounts = { yes: 0, no: 0 };

    ballots.forEach(b => {
      if (candidateCounts[b.candidateId] !== undefined) {
        candidateCounts[b.candidateId]++;
      }
      if (referendumCounts[b.referendumChoice] !== undefined) {
        referendumCounts[b.referendumChoice]++;
      }
    });

    const totalVotes = ballots.length;
    const turnoutPercentage = voters.length > 0 ? ((totalVotes / voters.length) * 100).toFixed(1) : 0;

    return {
      candidateCounts,
      referendumCounts,
      totalVotes,
      turnoutPercentage,
      candidatesWithStats: CANDIDATES.map(c => {
        const count = candidateCounts[c.id] || 0;
        const pct = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : '0.0';
        return {
          ...c,
          count,
          percentage: pct
        };
      }).sort((a, b) => b.count - a.count)
    };
  };

  return (
    <ElectionContext.Provider
      value={{
        metadata: ELECTION_METADATA,
        candidates: CANDIDATES,
        referendums: REFERENDUMS,
        voters,
        ballots,
        spentNullifiers,
        officialRoot,
        currentCalculatedRoot,
        isLedgerCompromised,
        currentMerkleTree,
        tallyCeremonyConducted,
        lastReceipt,
        auditLog,
        castBallot,
        tamperBallot,
        restoreBallot,
        conductTallyCeremony,
        batchSimulateVotes,
        addCustomVoter,
        resetElection,
        calculateResults,
        logEvent
      }}
    >
      {children}
    </ElectionContext.Provider>
  );
}

export function useElection() {
  const context = useContext(ElectionContext);
  if (!context) {
    throw new Error('useElection must be used within an ElectionProvider');
  }
  return context;
}
