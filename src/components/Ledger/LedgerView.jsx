import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { MerkleTree, hashSync } from '../../utils/crypto';
import { 
  Database, 
  GitBranch, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Search, 
  FileTerminal, 
  Lock, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  ArrowRight,
  Eye,
  Wrench,
  Clock
} from 'lucide-react';

export default function LedgerView({ initialAuditedTracker }) {
  const { 
    ballots, 
    candidates,
    officialRoot, 
    currentCalculatedRoot, 
    isLedgerCompromised, 
    currentMerkleTree,
    tamperBallot, 
    restoreBallot, 
    auditLog 
  } = useElection();

  const [searchTracker, setSearchTracker] = useState(initialAuditedTracker || '');
  const [selectedLeafIndex, setSelectedLeafIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('tree'); // 'tree' | 'tamper' | 'proof' | 'audit'
  const [verificationResult, setVerificationResult] = useState(null);
  const [copiedHash, setCopiedHash] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Run cryptographic proof verification for a tracker ID or selected leaf
  const runProofVerification = (trackerIdToVerify) => {
    const target = ballots.find(b => b.trackerId === trackerIdToVerify);
    if (!target) {
      setVerificationResult({
        success: false,
        message: `Tracker ID "${trackerIdToVerify}" not found in current ledger.`
      });
      return;
    }

    const index = ballots.findIndex(b => b.trackerId === trackerIdToVerify);
    const proof = currentMerkleTree.getProof(index);
    const isValidAgainstCurrent = MerkleTree.verifyProof(target.leafHash, proof, currentCalculatedRoot);
    const isValidAgainstOfficial = MerkleTree.verifyProof(target.leafHash, proof, officialRoot);

    setVerificationResult({
      success: isValidAgainstCurrent && isValidAgainstOfficial && !target.tampered,
      ballot: target,
      leafIndex: index,
      proof,
      currentRoot: currentCalculatedRoot,
      officialRoot,
      isValidAgainstCurrent,
      isValidAgainstOfficial,
      isTampered: target.tampered,
      message: target.tampered
        ? 'CRITICAL ALERT: Leaf payload was modified! Merkle integrity check failed against Official Root.'
        : !isValidAgainstOfficial
          ? 'INTEGRITY MISMATCH: Calculated tree root does not match signed election root!'
          : 'CRYPTOGRAPHIC PROOF VERIFIED: Ballot is mathematically proven included in the immutable Merkle Root.'
    });
  };

  const selectedBallot = ballots[selectedLeafIndex] || ballots[0];

  return (
    <div className="space-y-6">
      
      {/* Ledger Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
              <Database className="w-3.5 h-3.5" />
              Verifiable Cryptographic Audit Ledger
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Merkle Tree Integrity & Tamper Lab
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              Inspect how every vote is encrypted and anchored in a cryptographic Merkle Tree. Simulate insider database corruption to witness the hash avalanche effect and automated tamper detection.
            </p>
          </div>

          {/* Root status summary card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-w-[280px] shrink-0 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Leaves:</span>
              <span className="text-white font-bold">{ballots.length} ballots</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Official Root:</span>
              <span className="text-emerald-400 truncate max-w-[140px]" title={officialRoot}>
                {officialRoot.substring(0, 10)}...
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Calculated Root:</span>
              <span className={`truncate max-w-[140px] font-bold ${isLedgerCompromised ? 'text-rose-400' : 'text-emerald-400'}`} title={currentCalculatedRoot}>
                {currentCalculatedRoot.substring(0, 10)}...
              </span>
            </div>
            <div className={`mt-2 pt-2 border-t border-slate-800 flex items-center gap-1.5 ${isLedgerCompromised ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
              {isLedgerCompromised ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span>{isLedgerCompromised ? 'ROOT COMPROMISED!' : 'LEDGER VERIFIED 100%'}</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('tree')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'tree' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Merkle Tree Visualizer</span>
          </button>

          <button
            onClick={() => setActiveTab('proof')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'proof' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Receipt Sibling Proof Verifier</span>
          </button>

          <button
            onClick={() => setActiveTab('tamper')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'tamper' 
                ? 'bg-rose-700 text-white' 
                : isLedgerCompromised 
                  ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Adversarial Tamper Simulator</span>
            {isLedgerCompromised && <span className="bg-rose-900 text-[10px] px-1 rounded">ALERT</span>}
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === 'audit' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileTerminal className="w-3.5 h-3.5" />
            <span>System Audit Event Log ({auditLog.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Merkle Tree Visualizer */}
      {activeTab === 'tree' && (
        <div className="space-y-6">
          
          {/* Visual Architecture Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-cyan-400" />
                  Hierarchical Merkle Tree Layer Decomposition
                </h3>
                <p className="text-xs text-slate-400">
                  Recursive binary pairing: Leaf Nodes → Intermediate Branch Hashes → Signed Election Merkle Root.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Tree Height: <span className="text-cyan-400">{currentMerkleTree.layers.length} levels</span>
              </div>
            </div>

            {/* Tree Render Layers */}
            {ballots.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-mono text-xs border border-dashed border-slate-800 rounded-lg">
                No ballots in ledger yet. Cast a vote in the Voting Kiosk or click "+5 Mock Votes" above to populate the tree!
              </div>
            ) : (
              <div className="space-y-4 overflow-x-auto py-2">
                {/* Render Layers from Root down to Leaves */}
                {currentMerkleTree.layers.slice().reverse().map((layer, reverseIdx) => {
                  const layerIdx = currentMerkleTree.layers.length - 1 - reverseIdx;
                  const isRootLayer = layerIdx === currentMerkleTree.layers.length - 1;
                  const isLeafLayer = layerIdx === 0;

                  return (
                    <div key={layerIdx} className="space-y-1.5 bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {isRootLayer ? 'Layer Root (Election Checkpoint):' : isLeafLayer ? 'Layer 0 (Ballot Leaf Hashes):' : `Layer ${layerIdx} (Branch Hashes):`}
                        </span>
                        <span>{layer.length} node{layer.length > 1 ? 's' : ''}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 items-center">
                        {layer.map((hash, nodeIdx) => {
                          const isCompromisedRoot = isRootLayer && isLedgerCompromised;
                          return (
                            <div
                              key={nodeIdx}
                              className={`p-2 rounded font-mono text-xs border transition-all ${
                                isCompromisedRoot
                                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md shadow-rose-950/50 animate-pulse'
                                  : isRootLayer
                                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200'
                                    : isLeafLayer
                                      ? ballots[nodeIdx]?.tampered
                                        ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                                        : 'bg-slate-900 border-slate-700 text-cyan-300'
                                      : 'bg-slate-950 border-slate-800 text-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] text-slate-500 uppercase">
                                  {isRootLayer ? 'ROOT' : `#${nodeIdx}`}:
                                </span>
                                <span>{hash.substring(0, 12)}...{hash.substring(hash.length - 4)}</span>
                                <button
                                  onClick={() => copyToClipboard(hash, `hash-${layerIdx}-${nodeIdx}`)}
                                  className="text-slate-500 hover:text-slate-200 cursor-pointer ml-1"
                                  title="Copy full 64-character SHA-256 hash"
                                >
                                  {copiedHash === `hash-${layerIdx}-${nodeIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Table of all Committed Ballots in Ledger */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                Immutable Ballot Store ({ballots.length} records)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Encrypted Client-Side • Decoupled from Student ID
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Leaf #</th>
                    <th className="py-3 px-4">Tracker ID</th>
                    <th className="py-3 px-4">Nullifier (Public)</th>
                    <th className="py-3 px-4">Envelope Ciphertext</th>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {ballots.map((b, idx) => (
                    <tr 
                      key={b.id} 
                      className={`hover:bg-slate-800/50 transition-colors ${
                        b.tampered ? 'bg-rose-950/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-400">
                        #{idx}
                      </td>
                      <td className="py-3 px-4 text-cyan-300 font-bold select-all">
                        {b.trackerId}
                      </td>
                      <td className="py-3 px-4 text-purple-300 truncate max-w-[120px]" title={b.nullifier}>
                        {b.nullifier.substring(0, 14)}...
                      </td>
                      <td className="py-3 px-4 text-slate-400 truncate max-w-[160px]" title={b.rawCiphertext}>
                        {b.encryptedEnvelope?.ciphertext || b.rawCiphertext}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {new Date(b.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-3 px-4">
                        {b.tampered ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 text-[10px] font-bold">
                            TAMPERED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                            AUTHENTIC
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSearchTracker(b.trackerId);
                            setActiveTab('proof');
                            runProofVerification(b.trackerId);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-slate-300 text-[11px] cursor-pointer transition-colors"
                        >
                          Verify Proof
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ballots.length === 0 && (
                    <tr>
                      <td colSpan="7" className="py-8 text-center text-slate-500">
                        No ballots cast yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: Receipt Sibling Proof Verifier */}
      {activeTab === 'proof' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              End-to-End Individual Verifiability: Merkle Proof Calculator
            </h3>
            <p className="text-xs text-slate-400">
              Students and independent auditors can take any Voter Receipt Tracker ID and reconstruct the exact hash path from the leaf up to the official published election root without knowing anyone's vote.
            </p>

            {/* Input Search Form */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Paste Ballot Tracker ID (e.g. TRK-A7B8C9D0E1F2)..."
                  value={searchTracker}
                  onChange={(e) => setSearchTracker(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={() => runProofVerification(searchTracker)}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-900/30 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify Merkle Path</span>
              </button>
            </div>

            {/* Quick Pick from Cast Ballots */}
            {ballots.length > 0 && (
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Quick Pick Tracker:</span>
                {ballots.slice(0, 5).map((b) => (
                  <button
                    key={b.trackerId}
                    onClick={() => {
                      setSearchTracker(b.trackerId);
                      runProofVerification(b.trackerId);
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono text-[10px] cursor-pointer"
                  >
                    {b.trackerId} {b.tampered ? '(Tampered)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Verification Result Display */}
          {verificationResult && (
            <div className={`p-5 rounded-xl border space-y-4 ${
              verificationResult.success 
                ? 'bg-emerald-950/40 border-emerald-500/60' 
                : 'bg-rose-950/40 border-rose-500/60'
            }`}>
              <div className="flex items-start gap-3">
                {verificationResult.success ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className={`text-base font-bold ${verificationResult.success ? 'text-emerald-200' : 'text-rose-200'}`}>
                    {verificationResult.message}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {verificationResult.success
                      ? `Ballot ${verificationResult.ballot.trackerId} was verified mathematically in Leaf #${verificationResult.leafIndex}.`
                      : 'The hash reconstructed from sibling proofs does not match the official election root published at genesis.'
                    }
                  </p>
                </div>
              </div>

              {/* Sibling Path Breakdown */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-3">
                <div className="text-[11px] font-sans font-semibold text-slate-300 uppercase tracking-wider">
                  Step-by-Step Proof Path Execution:
                </div>

                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <span className="text-slate-500">Leaf #{verificationResult.leafIndex}:</span>
                    <span className="truncate">{verificationResult.ballot.leafHash}</span>
                  </div>

                  {verificationResult.proof.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 pl-4 text-slate-300">
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="text-slate-500">Hash with {step.position} sibling:</span>
                      <span className="text-purple-300 truncate">{step.hash.substring(0, 28)}...</span>
                    </div>
                  ))}

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-400">Calculated Root:</span>
                    <span className={verificationResult.success ? 'text-emerald-400' : 'text-rose-400'}>
                      {verificationResult.currentRoot}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Official Published Root:</span>
                    <span className="text-emerald-400 font-bold">
                      {verificationResult.officialRoot}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Adversarial Tamper Simulator */}
      {activeTab === 'tamper' && (
        <div className="space-y-6">
          <div className="bg-rose-950/20 border border-rose-900/60 rounded-xl p-5 space-y-3">
            <h3 className="text-base font-semibold text-rose-200 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-rose-400" />
              Instructor / Student Lab: Database Manipulation Simulator
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In this cybersecurity exercise, act as a malicious local database administrator who attempts to modify a cast ballot stored in SQLite / IndexedDB. Witness how the Merkle hash avalanche immediately reveals the discrepancy.
            </p>
          </div>

          {ballots.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs font-mono">
              Please cast at least one vote or click "+5 Mock Votes" in the header before attempting the tamper simulation!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left: Tamper Controls */}
              <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <h4 className="text-sm font-semibold text-white">1. Select Target Ballot to Tamper</h4>
                
                <div className="space-y-2">
                  <label className="text-xs text-slate-400">Target Leaf in Ledger:</label>
                  <select
                    value={selectedLeafIndex}
                    onChange={(e) => setSelectedLeafIndex(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono cursor-pointer"
                  >
                    {ballots.map((b, idx) => (
                      <option key={b.id} value={idx}>
                        Leaf #{idx} — {b.trackerId} {b.tampered ? '[TAMPERED]' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="text-slate-400">Original Recorded Choice:</div>
                  <div className="text-white font-bold">
                    {candidates.find(c => c.id === selectedBallot?.originalCandidateId)?.name || 'Elena Rostova'}
                  </div>
                  <div className="text-slate-400 pt-1">Current State:</div>
                  <div className={selectedBallot?.tampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {selectedBallot?.tampered ? 'TAMPERED CHOICES' : 'AUTHENTIC INTEGRITY'}
                  </div>
                </div>

                {/* Forged Choice Injection */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-400">Inject Fraudulent Choice:</label>
                  <div className="grid grid-cols-1 gap-2">
                    {candidates.map((cand) => (
                      <button
                        key={cand.id}
                        onClick={() => tamperBallot(selectedLeafIndex, cand.id)}
                        disabled={selectedBallot?.candidateId === cand.id}
                        className={`p-2 rounded-lg border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                          selectedBallot?.candidateId === cand.id
                            ? 'bg-rose-950/80 border-rose-600 text-rose-200 cursor-not-allowed'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span>{cand.avatar} {cand.name}</span>
                        <span className="text-[10px] text-rose-400 font-mono">Inject Choice</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Restore Button */}
                {selectedBallot?.tampered && (
                  <button
                    onClick={() => restoreBallot(selectedLeafIndex)}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold text-slate-950 text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md shadow-emerald-900/30"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore Authentic Leaf #{selectedLeafIndex}</span>
                  </button>
                )}
              </div>

              {/* Right: Avalanche Effect & Audit Impact */}
              <div className="md:col-span-7 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
                  <h4 className="text-sm font-sans font-semibold text-white">2. Cryptographic Avalanche Analysis</h4>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px] uppercase">Official Public Root (Signed Checkpoint):</div>
                      <div className="text-emerald-400 break-all select-all">{officialRoot}</div>
                    </div>

                    <div className={`p-3 rounded-lg border space-y-1 ${
                      isLedgerCompromised ? 'bg-rose-950/60 border-rose-600' : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="text-slate-400 text-[10px] uppercase">Recomputed Root from Current Database:</div>
                      <div className={`break-all select-all font-bold ${isLedgerCompromised ? 'text-rose-300' : 'text-emerald-400'}`}>
                        {currentCalculatedRoot}
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg border text-xs leading-relaxed ${
                      isLedgerCompromised 
                        ? 'bg-rose-950/70 border-rose-500 text-rose-200' 
                        : 'bg-emerald-950/40 border-emerald-600 text-emerald-200'
                    }`}>
                      <strong>Academic Takeaway:</strong> {isLedgerCompromised ? (
                        <span>
                          Notice that tampering with a single candidate ID in Leaf #{selectedLeafIndex} caused its SHA-256 hash to change completely. This new hash cascaded upwards through parent nodes, causing the calculated Root to completely diverge from the official checkpoint. An attacker CANNOT tamper with election results without instant algorithmic detection!
                        </span>
                      ) : (
                        <span>
                          All leaves currently evaluate cleanly against the official genesis root. To test tamper detection, click one of the "Inject Choice" buttons on the left.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* TAB 4: System Audit Event Log */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileTerminal className="w-4 h-4 text-cyan-400" />
              Immutable Security Event Stream (Live Telemetry)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Retention: Last 50 events
            </span>
          </div>

          <div className="divide-y divide-slate-800/80 font-mono text-xs max-h-[500px] overflow-y-auto">
            {auditLog.map((log) => {
              const isAlert = log.level.includes('ALERT') || log.level.includes('CRITICAL');
              const isSuccess = log.level === 'SUCCESS';
              const isWarning = log.level === 'WARNING';

              return (
                <div key={log.id} className="p-3.5 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      isAlert 
                        ? 'bg-rose-950 text-rose-300 border border-rose-700' 
                        : isSuccess 
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                          : isWarning 
                            ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                            : 'bg-slate-800 text-slate-300'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-semibold shrink-0">
                      [{log.source}]
                    </span>
                    <span className="text-slate-300 text-xs">
                      {log.message}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 whitespace-nowrap pl-4">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
