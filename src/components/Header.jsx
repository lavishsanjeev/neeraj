import React from 'react';
import { useElection } from '../context/ElectionContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  Lock, 
  RotateCcw, 
  Vote, 
  CheckCircle2, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export default function Header({ onOpenReport }) {
  const { 
    metadata, 
    ballots, 
    voters, 
    isLedgerCompromised, 
    currentCalculatedRoot, 
    officialRoot,
    resetElection,
    batchSimulateVotes
  } = useElection();

  const handleReset = () => {
    if (window.confirm('Reset all election data, ballots, nullifiers, and voter statuses back to default?')) {
      resetElection();
    }
  };

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className={`p-2.5 rounded-xl border ${
              isLedgerCompromised 
                ? 'bg-rose-950/60 border-rose-600 text-rose-400 animate-pulse' 
                : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
            }`}>
              {isLedgerCompromised ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLedgerCompromised ? 'bg-rose-400' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                isLedgerCompromised ? 'bg-rose-500' : 'bg-emerald-500'
              }`}></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                VoteShield <span className="text-cyan-400 font-mono text-xs bg-cyan-950/80 border border-cyan-800/80 px-2 py-0.5 rounded-full">AI v1.2</span>
              </h1>
              <span className="hidden sm:inline-block text-xs text-slate-400 border-l border-slate-700 pl-2">
                Offline-First Voting Security Simulator
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono truncate max-w-md">
              {metadata.title} • {metadata.institution}
            </p>
          </div>
        </div>

        {/* Security badges & Root status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          
          {/* Offline Airgap Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700/80 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">Air-Gap Local Engine</span>
          </div>

          {/* Ledger Integrity Indicator */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono ${
            isLedgerCompromised 
              ? 'bg-rose-950/80 border-rose-600 text-rose-300 animate-pulse' 
              : 'bg-emerald-950/50 border-emerald-800 text-emerald-300'
          }`}>
            {isLedgerCompromised ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>ROOT TAMPER DETECTED!</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Root: {currentCalculatedRoot.substring(0, 8)}...</span>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => batchSimulateVotes(5)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 transition-colors cursor-pointer"
            title="Batch simulate 5 random student votes"
          >
            <Vote className="w-3.5 h-3.5 text-indigo-400" />
            <span>+5 Mock Votes</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors cursor-pointer"
            title="Export Verifiable Election Audit Certificate"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Audit Certificate</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-rose-950/80 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
            title="Reset Simulator to default demo state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>

        </div>
      </div>

      {/* Warning banner when ledger is compromised */}
      {isLedgerCompromised && (
        <div className="bg-rose-950/90 border-t border-b border-rose-600 px-4 py-2 text-rose-200 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>CRITICAL AUDIT MISMATCH:</strong> Current recomputed Merkle Root (<code>{currentCalculatedRoot.substring(0, 16)}...</code>) diverges from Official Published Root (<code>{officialRoot.substring(0, 16)}...</code>). A ballot in the local database has been tampered with!
            </span>
          </div>
          <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-rose-900 text-rose-100 font-bold">
            Audit Alert Triggered
          </span>
        </div>
      )}
    </header>
  );
}
