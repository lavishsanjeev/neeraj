import React, { useState } from 'react';
import { CANDIDATES, REFERENDUMS } from '../../utils/mockData';
import { Check, Shield, Vote, AlertCircle } from 'lucide-react';

export default function BallotForm({ onSubmit, onBack, voter }) {
  const [selectedCandidate, setSelectedCandidate] = useState(CANDIDATES[0].id);
  const [selectedReferendum, setSelectedReferendum] = useState('yes');
  const [expandedPlatform, setExpandedPlatform] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      candidateId: selectedCandidate,
      referendumChoice: selectedReferendum
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Kiosk Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl bg-slate-800 p-2 rounded-lg border border-slate-700">
            {voter.avatar}
          </div>
          <div>
            <div className="text-sm font-semibold text-white flex items-center gap-2">
              <span>{voter.name}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                AI Authenticated
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Student ID: {voter.studentId} • {voter.department}
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono text-right hidden sm:block">
          <div>Ballot Integrity: <span className="text-emerald-400">Encrypted in RAM</span></div>
          <div>Secret Nullifier: <span className="text-cyan-400">Ready</span></div>
        </div>
      </div>

      {/* Presidential Slate Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Vote className="w-4 h-4 text-cyan-400" />
            1. Executive Council Presidential Slate (Choose 1)
          </h4>
          <span className="text-xs text-slate-400 font-mono">1-out-of-4 Selection</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CANDIDATES.map((candidate) => {
            const isSelected = selectedCandidate === candidate.id;
            const isExpanded = expandedPlatform === candidate.id;

            return (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate.id)}
                className={`relative rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/50'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl select-none">{candidate.avatar}</span>
                    <div>
                      <h5 className="font-semibold text-white text-sm">{candidate.name}</h5>
                      <span className="text-xs font-mono text-cyan-300/80 block">
                        {candidate.slate}
                      </span>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-600 bg-slate-800'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                      {candidate.badge}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedPlatform(isExpanded ? null : candidate.id);
                      }}
                      className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                    >
                      {isExpanded ? 'Hide platform' : 'View platform'}
                    </button>
                  </div>

                  {isExpanded && (
                    <p className="mt-2 text-slate-300 text-xs bg-slate-950/70 p-2.5 rounded border border-slate-800/80 leading-relaxed">
                      {candidate.platform}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referendum Section */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          2. Faculty Referendum: {REFERENDUMS[0].code}
        </h4>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
          <h5 className="text-sm font-medium text-slate-200">
            {REFERENDUMS[0].title}
          </h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            {REFERENDUMS[0].description}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedReferendum('yes')}
              className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                selectedReferendum === 'yes'
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-950/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedReferendum === 'yes' ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-600'
              }`}>
                {selectedReferendum === 'yes' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>IN FAVOR (YES)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedReferendum('no')}
              className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                selectedReferendum === 'no'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-200 shadow-md shadow-rose-950/30'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedReferendum === 'no' ? 'bg-rose-500 border-rose-400 text-slate-950' : 'border-slate-600'
              }`}>
                {selectedReferendum === 'no' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <span>OPPOSED (NO)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Notice and Proceed Button */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-400 max-w-md">
          <span className="text-slate-200 font-semibold block mb-0.5">Ballot Privacy Notice:</span>
          Your choices will be sealed in an asymmetric cryptographic envelope and paired strictly with a zero-knowledge nullifier. Your real name and Student ID will NEVER appear in the public bulletin board.
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
          >
            Back to Biometrics
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs tracking-wide shadow-lg shadow-cyan-900/30 cursor-pointer transition-all flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Generate Cryptographic Proof</span>
          </button>
        </div>
      </div>

    </form>
  );
}
