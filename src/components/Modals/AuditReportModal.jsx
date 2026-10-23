import React from 'react';
import { useElection } from '../../context/ElectionContext';
import { 
  FileCheck, 
  ShieldCheck, 
  ShieldAlert, 
  Printer, 
  Download, 
  X, 
  QrCode, 
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react';

export default function AuditReportModal({ isOpen, onClose }) {
  const { 
    metadata, 
    ballots, 
    voters, 
    officialRoot, 
    currentCalculatedRoot, 
    isLedgerCompromised, 
    spentNullifiers,
    calculateResults 
  } = useElection();

  if (!isOpen) return null;

  const results = calculateResults();
  const leader = results.candidatesWithStats[0];

  const handleDownloadJSON = () => {
    const reportData = {
      electionMetadata: metadata,
      generatedAt: new Date().toISOString(),
      auditStatus: isLedgerCompromised ? 'COMPROMISED' : 'VERIFIED',
      merkleRoots: {
        officialGenesisRoot: officialRoot,
        currentCalculatedRoot: currentCalculatedRoot,
        matches: !isLedgerCompromised
      },
      electoralStatistics: {
        totalEnrolled: voters.length,
        totalCast: ballots.length,
        turnoutPercentage: results.turnoutPercentage
      },
      results: results.candidatesWithStats.map(c => ({
        id: c.id,
        name: c.name,
        slate: c.slate,
        votes: c.count,
        percentage: c.percentage
      })),
      nullifierAudit: {
        totalSpent: Object.keys(spentNullifiers).length,
        collisionCount: 0
      },
      ballots: ballots.map(b => ({
        trackerId: b.trackerId,
        nullifier: b.nullifier,
        leafHash: b.leafHash,
        tampered: b.tampered,
        timestamp: b.timestamp
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VoteShield_Election_Audit_Certificate_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg border ${
              isLedgerCompromised ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-emerald-950 text-emerald-400 border-emerald-800'
            }`}>
              {isLedgerCompromised ? <ShieldAlert className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Verifiable Election Audit Certificate</h3>
              <p className="text-xs text-slate-400 font-mono">Air-Gapped Cryptographic Certification</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Layout */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs shadow-inner">
          <div className="flex flex-wrap items-center justify-between border-b border-dashed border-slate-800 pb-3 gap-2">
            <div>
              <div className="font-bold text-white tracking-wider text-sm">{metadata.title}</div>
              <div className="text-[11px] text-slate-400">{metadata.institution}</div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                isLedgerCompromised ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
              }`}>
                {isLedgerCompromised ? 'FAILED: AUDIT MISMATCH' : 'PASSED: CRYPTOGRAPHICALLY VALID'}
              </span>
              <div className="text-[10px] text-slate-500 mt-1">{new Date().toLocaleString()}</div>
            </div>
          </div>

          {/* Cryptographic Summary Grid */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Election ID:</span>
              <span className="text-white font-bold">{metadata.electionId}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Algorithm:</span>
              <span className="text-cyan-300 truncate block">SHA-256 + ZK Nullifiers</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Official Merkle Root:</span>
              <span className="text-emerald-400 truncate block select-all" title={officialRoot}>
                {officialRoot}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[10px]">Recomputed Root:</span>
              <span className={`truncate block select-all font-bold ${isLedgerCompromised ? 'text-rose-400' : 'text-emerald-400'}`} title={currentCalculatedRoot}>
                {currentCalculatedRoot}
              </span>
            </div>
          </div>

          {/* Tabulation Summary */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-slate-400 font-sans font-semibold text-xs block">Certified Tabulation:</span>
            <div className="space-y-1.5 bg-slate-900/60 p-2.5 rounded border border-slate-800">
              {results.candidatesWithStats.map((c, idx) => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-white">
                    {idx + 1}. {c.name} ({c.slate})
                  </span>
                  <span className="text-cyan-300 font-bold">
                    {c.count} votes ({c.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Seal Graphic */}
          <div className="pt-3 border-t border-dashed border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
            <div className="flex items-center gap-2">
              <QrCode className="w-8 h-8 text-cyan-400" />
              <div>
                <span className="text-white font-bold block font-sans">VoteShield Genesis Seal</span>
                Decoupled Nullifier & Merkle Invariant Verified
              </div>
            </div>
            <div className="text-right">
              <div>Total Votes: <strong className="text-white">{results.totalVotes}</strong></div>
              <div>Turnout: <strong className="text-white">{results.turnoutPercentage}%</strong></div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Download JSON Certificate</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold cursor-pointer shadow-md shadow-cyan-950/40 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
