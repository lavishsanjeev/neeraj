import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import BiometricAuth from './BiometricAuth';
import BallotForm from './BallotForm';
import CryptographicStep from './CryptographicStep';
import ReceiptModal from './ReceiptModal';
import { 
  Vote, 
  UserCheck, 
  ShieldAlert, 
  ArrowRight, 
  RotateCcw, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';

export default function KioskView({ onAuditReceipt }) {
  const { voters, spentNullifiers, lastReceipt } = useElection();

  const [selectedVoterId, setSelectedVoterId] = useState(voters[0]?.id || '');
  const [step, setStep] = useState(1); // 1: Biometrics, 2: Ballot, 3: Cryptography
  const [authDetails, setAuthDetails] = useState(null);
  const [ballotData, setBallotData] = useState(null);
  const [activeReceipt, setActiveReceipt] = useState(null);

  const selectedVoter = voters.find(v => v.id === selectedVoterId) || voters[0];

  const handleAuthenticated = (details) => {
    setAuthDetails(details);
    setStep(2);
  };

  const handleBallotSelect = (choices) => {
    setBallotData(choices);
    setStep(3);
  };

  const handleBallotCommitted = (receipt) => {
    setActiveReceipt(receipt);
  };

  const handleReceiptClose = () => {
    setActiveReceipt(null);
    setStep(1);
    setAuthDetails(null);
    setBallotData(null);
    // Auto pick next unvoted student if available
    const nextUnvoted = voters.find(v => !v.hasVoted && v.id !== selectedVoterId);
    if (nextUnvoted) {
      setSelectedVoterId(nextUnvoted.id);
    }
  };

  const resetKioskSession = () => {
    setStep(1);
    setAuthDetails(null);
    setBallotData(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Kiosk Hero / Mode Selector */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              Air-Gapped Offline Voting Station #01
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive AI Biometric Voting Kiosk
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              Step into the role of an engineering student casting a ballot. Experience offline edge facial liveness verification, client-side zero-knowledge nullifier derivation, and envelope encryption before recording onto the local Merkle ledger.
            </p>
          </div>

          {/* Voter Profile Switcher */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 min-w-[280px] sm:min-w-[320px] shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="voter-select" className="font-semibold text-slate-300 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                Active Student Identity:
              </label>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                selectedVoter?.hasVoted 
                  ? 'bg-purple-950 text-purple-300 border border-purple-800' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {selectedVoter?.hasVoted ? 'Has Cast Ballot' : 'Eligible to Vote'}
              </span>
            </div>

            <select
              id="voter-select"
              value={selectedVoterId}
              onChange={(e) => {
                setSelectedVoterId(e.target.value);
                resetKioskSession();
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
            >
              {voters.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.avatar} {v.name} ({v.studentId}) {v.hasVoted ? '— [VOTED]' : ''}
                </option>
              ))}
            </select>

            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Dept: {selectedVoter?.department?.split(' ')[0]}...</span>
              <button
                type="button"
                onClick={resetKioskSession}
                className="text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Step
              </button>
            </div>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 transition-colors ${
            step === 1 
              ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-200' 
              : step > 1 
                ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              step > 1 ? 'bg-emerald-500 text-slate-950' : step === 1 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {step > 1 ? '✓' : '1'}
            </span>
            <div className="truncate">
              <div className="font-semibold text-white">Biometric Auth</div>
              <div className="text-[10px] text-slate-400 hidden sm:block">AI Liveness & 3D Depth</div>
            </div>
          </div>

          <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 transition-colors ${
            step === 2 
              ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-200' 
              : step > 2 
                ? 'bg-slate-900/60 border-emerald-500/40 text-emerald-300' 
                : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              step > 2 ? 'bg-emerald-500 text-slate-950' : step === 2 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {step > 2 ? '✓' : '2'}
            </span>
            <div className="truncate">
              <div className="font-semibold text-white">Ballot Selection</div>
              <div className="text-[10px] text-slate-400 hidden sm:block">Candidate & Referendum</div>
            </div>
          </div>

          <div className={`p-2.5 sm:p-3 rounded-xl border flex items-center gap-3 transition-colors ${
            step === 3 
              ? 'bg-cyan-950/60 border-cyan-500/80 text-cyan-200' 
              : 'bg-slate-950/40 border-slate-800 text-slate-500'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              step === 3 ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              3
            </span>
            <div className="truncate">
              <div className="font-semibold text-white">Crypto Sealing</div>
              <div className="text-[10px] text-slate-400 hidden sm:block">Nullifier & Merkle Commit</div>
            </div>
          </div>
        </div>

      </div>

      {/* Warning if voter has already voted */}
      {selectedVoter?.hasVoted && (
        <div className="bg-amber-950/60 border border-amber-600/70 rounded-xl p-4 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong>Instructor Simulation Note:</strong> {selectedVoter.name} has already cast a ballot. You can proceed through the steps to observe the cryptographic <strong>Nullifier Collision protection</strong> in Step 3!
            </div>
          </div>
        </div>
      )}

      {/* Main Step Body */}
      {step === 1 && (
        <BiometricAuth 
          selectedVoter={selectedVoter} 
          onAuthenticated={handleAuthenticated} 
        />
      )}

      {step === 2 && (
        <BallotForm 
          voter={selectedVoter} 
          onSubmit={handleBallotSelect} 
          onBack={() => setStep(1)} 
        />
      )}

      {step === 3 && (
        <CryptographicStep 
          voter={selectedVoter} 
          ballotData={ballotData} 
          onCommitted={handleBallotCommitted} 
          onBack={() => setStep(2)} 
        />
      )}

      {/* Receipt Modal */}
      {activeReceipt && (
        <ReceiptModal 
          receipt={activeReceipt} 
          onClose={handleReceiptClose} 
          onAuditReceipt={onAuditReceipt} 
        />
      )}

    </div>
  );
}
