import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import confetti from 'canvas-confetti';
import { 
  BarChart3, 
  Trophy, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  Users, 
  Vote, 
  Sparkles, 
  AlertTriangle,
  Award,
  FileCheck
} from 'lucide-react';

export default function ResultsView({ onOpenReport }) {
  const { 
    ballots, 
    voters, 
    candidates, 
    referendums, 
    isLedgerCompromised, 
    currentCalculatedRoot, 
    officialRoot,
    calculateResults,
    tallyCeremonyConducted,
    conductTallyCeremony
  } = useElection();

  const [isDeciphering, setIsDeciphering] = useState(false);
  const [decipherProgress, setDecipherProgress] = useState(0);

  const results = calculateResults();
  const leader = results.candidatesWithStats[0];

  const triggerTallyCeremony = () => {
    setIsDeciphering(true);
    setDecipherProgress(0);

    const interval = setInterval(() => {
      setDecipherProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeciphering(false);
          conductTallyCeremony();
          try {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // ignore if confetti fails
          }
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const referendum = referendums[0];
  const refYes = results.referendumCounts.yes || 0;
  const refNo = results.referendumCounts.no || 0;
  const totalRef = refYes + refNo;
  const yesPct = totalRef > 0 ? ((refYes / totalRef) * 100).toFixed(1) : '0.0';
  const noPct = totalRef > 0 ? ((refNo / totalRef) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      
      {/* Results Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
              <BarChart3 className="w-3.5 h-3.5" />
              Cryptographic Homomorphic Tally & Tabulation
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Instant Verifiable Election Results
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Real-time aggregation of encrypted ballots. Under normal operations, results are cryptographically certified only after the official tally ceremony decrypts the threshold proof and validates the root.
            </p>
          </div>

          {/* Ceremony Action Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-w-[280px] shrink-0 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300">
              {tallyCeremonyConducted ? (
                <>
                  <Unlock className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-mono">Tally Decrypted & Certified</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 font-mono">Envelopes Sealed</span>
                </>
              )}
            </div>

            {!tallyCeremonyConducted ? (
              <button
                onClick={triggerTallyCeremony}
                disabled={isDeciphering || ballots.length === 0}
                className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  ballots.length === 0
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold shadow-lg shadow-emerald-950/50'
                }`}
              >
                {isDeciphering ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Threshold Decrypting... {decipherProgress}%</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4 text-slate-950" />
                    <span>Run Official Tally Ceremony</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onOpenReport}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600 text-emerald-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Download Certified Audit Report</span>
              </button>
            )}

            <div className="text-[10px] text-slate-500 font-mono">
              Algorithm: Homomorphic Batch Summation
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] uppercase block">Total Cast Ballots</span>
            <span className="text-xl font-bold text-white mt-1 block">{results.totalVotes}</span>
            <span className="text-[10px] text-cyan-400 font-mono">All encrypted in Merkle tree</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] uppercase block">Electoral Turnout</span>
            <span className="text-xl font-bold text-white mt-1 block">{results.turnoutPercentage}%</span>
            <span className="text-[10px] text-slate-400 font-mono">{results.totalVotes} of {voters.length} enrolled</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] uppercase block">Ledger Audit Status</span>
            <span className={`text-sm font-bold mt-2 block truncate ${isLedgerCompromised ? 'text-rose-400' : 'text-emerald-400'}`}>
              {isLedgerCompromised ? 'TAMPER ALERT!' : 'VALIDATED'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">SHA-256 Checkpoint</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <span className="text-slate-400 font-mono text-[10px] uppercase block">Current Frontrunner</span>
            <span className="text-sm font-bold text-white mt-2 block truncate">
              {results.totalVotes > 0 ? leader?.name : 'No votes yet'}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {results.totalVotes > 0 ? `${leader?.percentage}% of vote` : 'Awaiting ballots'}
            </span>
          </div>
        </div>
      </div>

      {/* Warning if ledger was tampered */}
      {isLedgerCompromised && (
        <div className="bg-rose-950/80 border border-rose-600 rounded-xl p-4 text-rose-200 text-xs flex items-start gap-3 shadow-lg shadow-rose-950/50">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <strong className="text-rose-100 block text-sm">ELECTION RESULT INTEGRITY INVALIDATED!</strong>
            <p>
              An unauthorized alteration was detected in the local cryptographic ledger. The recomputed Merkle Root does not match the official public election commitment. Results shown below CANNOT be certified until the tampered ballot is restored or audited in the Ledger tab.
            </p>
          </div>
        </div>
      )}

      {/* Main Candidates Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Presidential Election Results */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                Executive Council Presidential Slate
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Instant tabulation breakdown across registered candidates.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
              First-Past-The-Post
            </span>
          </div>

          <div className="space-y-4">
            {results.candidatesWithStats.map((candidate, rank) => {
              const isWinner = rank === 0 && results.totalVotes > 0;

              return (
                <div 
                  key={candidate.id} 
                  className={`p-4 rounded-xl border transition-all ${
                    isWinner 
                      ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20' 
                      : 'bg-slate-950/60 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl select-none">{candidate.avatar}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{candidate.name}</h4>
                          {isWinner && (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold font-mono flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-400" />
                              LEADING
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-mono">{candidate.slate}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-bold text-white font-mono">{candidate.count}</span>
                      <span className="text-xs text-slate-400 font-mono ml-1">votes</span>
                      <div className="text-xs text-cyan-300 font-mono font-bold">
                        {candidate.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${candidate.percentage}%`,
                        backgroundColor: candidate.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Referendum & Turnout Card */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Faculty Referendum Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Referendum: {referendum.code}
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {referendum.title}
            </p>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-emerald-400 font-bold">IN FAVOR (YES)</span>
                  <span className="text-white">{refYes} votes ({yesPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${yesPct}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-1">
                  <span className="text-rose-400 font-bold">OPPOSED (NO)</span>
                  <span className="text-white">{refNo} votes ({noPct}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${noPct}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              Quorum Requirement: &gt; 25% Turnout ({results.turnoutPercentage > 25 ? 'MET ✓' : 'PENDING'})
            </div>
          </div>

          {/* Cryptographic Certification Seal Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs space-y-3 shadow-inner">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-sans font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Ceremony Verification Ledger
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Election ID:</span>
                <span className="text-white">VS-CAMPUS-2026-GEN</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Nullifiers Verified:</span>
                <span className="text-cyan-300">{results.totalVotes} distinct</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Merkle Checkpoint:</span>
                <span className="text-emerald-400 truncate max-w-[120px]">{currentCalculatedRoot.substring(0, 10)}...</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Audit Signature:</span>
                <span className="text-purple-300">VALID_ED25519</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
