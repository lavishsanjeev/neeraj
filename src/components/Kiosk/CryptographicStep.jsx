import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { 
  generateNullifier, 
  encryptBallot, 
  hashSync 
} from '../../utils/crypto';
import { 
  Lock, 
  Key, 
  Binary, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle,
  Cpu,
  ShieldCheck
} from 'lucide-react';

export default function CryptographicStep({ voter, ballotData, onCommitted, onBack }) {
  const { metadata, castBallot, spentNullifiers, candidates, referendums } = useElection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Compute live preview of crypto operations
  const nullifier = generateNullifier(voter.secretKey, metadata.electionSalt);
  const isAlreadySpent = Boolean(spentNullifiers[nullifier]);

  const candidateObj = candidates.find(c => c.id === ballotData.candidateId);
  const refObj = referendums[0];

  const encryptedPreview = encryptBallot({
    candidateId: ballotData.candidateId,
    referendumChoice: ballotData.referendumChoice
  }, metadata.publicKey);

  const previewTimestamp = Date.now();
  const simulatedLeafHash = hashSync(`${nullifier}::${encryptedPreview.rawCiphertext}::${previewTimestamp}`);

  const handleCommit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    // Artificial short delay to give students visual appreciation of cryptographic work
    setTimeout(async () => {
      const result = await castBallot({
        voter,
        candidateId: ballotData.candidateId,
        referendumChoice: ballotData.referendumChoice
      });

      setIsSubmitting(false);

      if (result.success) {
        onCommitted(result.receipt);
      } else {
        setSubmissionError(result.message);
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Binary className="w-5 h-5 text-cyan-400" />
          Cryptographic Sealing & Zero-Knowledge Nullifier Pipeline
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Inspect how your voter identity is decoupled from your ballot choice before committing to the immutable ledger.
        </p>
      </div>

      {/* Double Vote Check Alert */}
      {isAlreadySpent && (
        <div className="bg-rose-950/80 border border-rose-600 rounded-xl p-4 text-rose-200 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-rose-100 block">SECURITY VIOLATION DETECTED: NULLIFIER COLLISION</strong>
            <p>
              The cryptographic nullifier for voter <code className="text-rose-300 font-mono">{voter.name}</code> has ALREADY been published and spent in this election.
            </p>
            <p className="text-rose-300/80">
              The Nullifier Registry enforces the mathematical invariant: <strong>Exactly 1 ballot per identity</strong>. Attempting to submit will trigger a hard rejection.
            </p>
          </div>
        </div>
      )}

      {/* 3 Cryptographic Pipeline Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Pillar 1: Nullifier */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 font-mono flex items-center gap-1.5">
              <Key className="w-4 h-4" />
              1. Deterministic Nullifier
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isAlreadySpent ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {isAlreadySpent ? 'ALREADY SPENT' : 'UNSPENT'}
            </span>
          </div>

          <div className="bg-slate-900/90 rounded p-2.5 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
            <div className="text-slate-400">Formula:</div>
            <div className="text-cyan-300">H(Voter_Secret || Election_Salt)</div>
            <div className="text-slate-500 pt-1 text-[10px]">Election Salt: {metadata.electionSalt.substring(0, 15)}...</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Published Nullifier Hash:</span>
            <div className="font-mono text-xs text-white bg-slate-900 p-2 rounded border border-slate-800 break-all select-all">
              {nullifier}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            This proves you are an eligible registered voter without disclosing which student ID you hold.
          </p>
        </div>

        {/* Pillar 2: Envelope Encryption */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-400 font-mono flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              2. Envelope Encryption
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
              AES-GCM / Paillier
            </span>
          </div>

          <div className="bg-slate-900/90 rounded p-2.5 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
            <div className="text-slate-400">Selected Choices (Plaintext):</div>
            <div className="text-white truncate">1. {candidateObj?.name}</div>
            <div className="text-white uppercase">2. Ref: {ballotData.referendumChoice}</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Ciphertext Payload:</span>
            <div className="font-mono text-xs text-purple-300 bg-slate-900 p-2 rounded border border-slate-800 break-all">
              {encryptedPreview.envelope.ciphertext}
            </div>
            <div className="text-[10px] font-mono text-slate-500">
              Ephemeral IV: {encryptedPreview.envelope.ephemeralIV}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Only the distributed election private key during the tally ceremony can decrypt this envelope.
          </p>
        </div>

        {/* Pillar 3: Merkle Leaf Commitment */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              3. Merkle Leaf Commit
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              SHA-256
            </span>
          </div>

          <div className="bg-slate-900/90 rounded p-2.5 font-mono text-[11px] text-slate-300 space-y-1 border border-slate-800">
            <div className="text-slate-400">Leaf Construction:</div>
            <div className="text-emerald-300">H(Nullifier || Cipher || Timestamp)</div>
            <div className="text-slate-500 pt-1 text-[10px]">Appended as next leaf in tree</div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono text-slate-400">Calculated Leaf Hash:</span>
            <div className="font-mono text-xs text-emerald-300 bg-slate-900 p-2 rounded border border-slate-800 break-all">
              {simulatedLeafHash}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 leading-normal">
            Guarantees tamper evidence. If any bit changes later, the Merkle root changes immediately.
          </p>
        </div>

      </div>

      {/* Submission error if any */}
      {submissionError && (
        <div className="p-3 bg-rose-950 border border-rose-700 rounded-lg text-rose-200 text-xs font-mono">
          Submission Rejected: {submissionError}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
        >
          Back to Ballot
        </button>

        <button
          type="button"
          onClick={handleCommit}
          disabled={isSubmitting || isAlreadySpent}
          className={`px-6 py-2.5 rounded-lg font-semibold text-xs tracking-wide flex items-center gap-2 cursor-pointer transition-all ${
            isAlreadySpent
              ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold shadow-lg shadow-cyan-900/30'
          }`}
        >
          {isSubmitting ? (
            <>
              <Cpu className="w-4 h-4 animate-spin text-slate-950" />
              <span>Broadcasting to Merkle Ledger...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>{isAlreadySpent ? 'Double-Vote Blocked' : 'Commit Ballot to Immutable Ledger'}</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
