import React, { useState } from 'react';
import { ATTACK_SCENARIOS } from '../../utils/mockData';
import { useElection } from '../../context/ElectionContext';
import { 
  FlaskConical, 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  Eye, 
  Key, 
  Database, 
  Cpu, 
  Info,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdversarialLab() {
  const { isLedgerCompromised, officialRoot, currentCalculatedRoot } = useElection();

  const [selectedAttackId, setSelectedAttackId] = useState(ATTACK_SCENARIOS[0].id);

  // Interactive controls for scenario 1 & 4 (AI Biometrics)
  const [livenessThreshold, setLivenessThreshold] = useState(0.80);
  const [adversarialEpsilon, setAdversarialEpsilon] = useState(0.04);
  const [simulatedNoiseApplied, setSimulatedNoiseApplied] = useState(false);

  // Interactive state for scenario 2 (Nullifiers)
  const [nullifierSaltMod, setNullifierSaltMod] = useState('VOTE-SHIELD-CAMPUS-2026-AIRGAP-SALT');
  const [testSecret, setTestSecret] = useState('VOTER_SEC_KEY_SOPHIA_99120');

  const activeScenario = ATTACK_SCENARIOS.find(a => a.id === selectedAttackId) || ATTACK_SCENARIOS[0];

  // Derived metrics for AI Liveness Simulation
  const baseLiveConfidence = 0.94;
  const photoSpoofScore = 0.28;
  const isSpoofBlocked = photoSpoofScore < livenessThreshold;
  const isGenuineAccepted = baseLiveConfidence >= livenessThreshold;

  // Adversarial perturbation impact
  const perturbedCosineDistance = Math.max(0.3, +(0.95 - (adversarialEpsilon * 4.2)).toFixed(2));
  const isAdversarialEvasionSuccess = perturbedCosineDistance < 0.70;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-mono">
              <FlaskConical className="w-3.5 h-3.5" />
              Engineering Security Sandbox
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Adversarial Threat Simulator: Controls vs. Limitations
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Designed for engineering students and instructors. Explore how VoteShield implements defense-in-depth cryptographic and AI controls, while rigorously acknowledging theoretical and physical attack surfaces.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5 Academic Test Vectors</span>
          </div>
        </div>

        {/* Attack Selector Badges */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800 overflow-x-auto text-xs scrollbar-none">
          {ATTACK_SCENARIOS.map((scenario) => {
            const isSelected = selectedAttackId === scenario.id;
            const isAI = scenario.type === 'ai-limitation';

            return (
              <button
                key={scenario.id}
                onClick={() => setSelectedAttackId(scenario.id)}
                className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all flex items-center gap-2 shrink-0 ${
                  isSelected
                    ? isAI
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-900/30'
                      : 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {isAI ? <Eye className="w-3.5 h-3.5" /> : <Database className="w-3.5 h-3.5" />}
                <span>{scenario.title.split(':')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Selected Scenario Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Detailed Threat Dossier */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                activeScenario.type === 'ai-limitation'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : activeScenario.type === 'security-control'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-purple-950 text-purple-300 border-purple-800'
              }`}>
                {activeScenario.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeScenario.principle}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight">
              {activeScenario.title}
            </h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div>
              <strong className="text-slate-100 block mb-1">Adversary Threat Model:</strong>
              <p className="text-slate-400">{activeScenario.description}</p>
            </div>
            <div className="pt-2 border-t border-slate-800">
              <strong className="text-slate-100 block mb-1">Technical Exploit Mechanism:</strong>
              <p className="text-slate-400">{activeScenario.mechanism}</p>
            </div>
          </div>

          {/* Defense Implementation */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/50 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Implemented Security Control (Defense-in-Depth):</span>
            </div>
            <p className="text-emerald-200/90 leading-relaxed">
              {activeScenario.securityControlDemonstration}
            </p>
          </div>

          {/* Realistic Limitation & Caveat */}
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/50 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-rose-300 font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Engineering Limitation & Academic Caveat:</span>
            </div>
            <p className="text-rose-200/90 leading-relaxed">
              {activeScenario.limitationCaveat}
            </p>
          </div>

        </div>

        {/* Right: Interactive Sandbox Controller */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Scenario 1: Presentation Attack / Screen Spoof Controls */}
          {activeScenario.id === 'attack-screen-spoof' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Live Liveness Threshold & Tuning Lab
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Liveness Cutoff Threshold (&theta;):</span>
                    <span className="text-cyan-400 font-bold">{livenessThreshold.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.40"
                    max="0.95"
                    step="0.05"
                    value={livenessThreshold}
                    onChange={(e) => setLivenessThreshold(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Permissive (High FAR Risk)</span>
                    <span>Strict (High FRR Risk)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">2D Photo Spoof Score:</span>
                    <span className="text-rose-400 font-bold">{photoSpoofScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Spoof Attack Outcome:</span>
                    <span className={isSpoofBlocked ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {isSpoofBlocked ? 'BLOCKED BY AI ✓' : 'ACCEPTED (FALSE ACCEPTANCE! ⚠️)'}
                    </span>
                  </div>

                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Live Genuine Voter Score:</span>
                    <span className="text-emerald-400 font-bold">{baseLiveConfidence}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Genuine Voter Outcome:</span>
                    <span className={isGenuineAccepted ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                      {isGenuineAccepted ? 'VERIFIED ✓' : 'REJECTED (FALSE REJECTION! ⚠️)'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  <strong>Biometric Trade-Off:</strong> If you increase &theta; to 0.95, spoofs are easily rejected, but legitimate students with imperfect lighting are turned away.
                </p>
              </div>
            </div>
          )}

          {/* Scenario 2: Double-Voting / Nullifiers */}
          {activeScenario.id === 'attack-double-voting' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                Nullifier Collision Inspector
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <p className="text-slate-400 leading-relaxed">
                  Nullifier derivation is deterministic: given the same secret and election salt, the output hash is identical:
                </p>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 break-all">
                  <div className="text-slate-400 text-[10px]">Test Voter Secret:</div>
                  <div className="text-cyan-300">{testSecret}</div>

                  <div className="text-slate-400 text-[10px] pt-1">Election Salt:</div>
                  <div className="text-purple-300">{nullifierSaltMod}</div>

                  <div className="text-slate-400 text-[10px] pt-1">Resulting Nullifier Token:</div>
                  <div className="text-emerald-400 font-bold">
                    0x7d81a9f02c4b8e31a0e19...
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-600/60 rounded-lg text-emerald-200 text-xs">
                  <strong>Cryptographic Guarantee:</strong> Because the Nullifier Registry tracks every spent nullifier hash, any second ballot cast with the same credentials fails at $O(1)$ lookup time, while revealing 0 bits of information about candidate choice.
                </div>
              </div>
            </div>
          )}

          {/* Scenario 3: Insider Ledger Tampering */}
          {activeScenario.id === 'attack-ledger-tamper' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-rose-400" />
                Live Merkle Avalanche State
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Official Genesis Root:</span>
                    <span className="text-emerald-400 truncate max-w-[150px]">{officialRoot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Recomputed Ledger Root:</span>
                    <span className={`truncate max-w-[150px] font-bold ${isLedgerCompromised ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {currentCalculatedRoot}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-800">
                    <span className="text-slate-400">Integrity Check:</span>
                    <span className={isLedgerCompromised ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {isLedgerCompromised ? 'TAMPERED (ALERT)' : 'MATCHED 100%'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  You can jump to the <strong>Cryptographic Ledger</strong> tab at any time to tamper with a real leaf and watch the entire tree flash red in real-time.
                </p>
              </div>
            </div>
          )}

          {/* Scenario 4: Adversarial Noise */}
          {activeScenario.id === 'attack-adversarial-noise' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-amber-400" />
                Adversarial Perturbation Generator
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>Noise Magnitude (&epsilon;):</span>
                    <span className="text-amber-400 font-bold">{adversarialEpsilon.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.00"
                    max="0.12"
                    step="0.01"
                    value={adversarialEpsilon}
                    onChange={(e) => setAdversarialEpsilon(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Clean Image (&epsilon;=0)</span>
                    <span>High Gradient Noise (&epsilon;=0.12)</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">128-d Cosine Similarity:</span>
                    <span className={`font-bold ${perturbedCosineDistance >= 0.75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {perturbedCosineDistance}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Model Classification:</span>
                    <span className={perturbedCosineDistance >= 0.75 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {perturbedCosineDistance >= 0.75 ? 'CORRECT IDENTITY' : 'EVASION SUCCESSFUL (MISMATCH)'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  <strong>Open Problem in AI:</strong> Imperceptible digital noise can cause an offline face verification model to misclassify a legitimate voter without human proctors noticing any visible anomaly.
                </p>
              </div>
            </div>
          )}

          {/* Scenario 5: Physical Coercion & Vote Selling */}
          {activeScenario.id === 'attack-coercion' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-purple-400" />
                The Receipt-Freeness Paradox
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="text-slate-300 font-semibold font-sans">Individual Verifiability:</div>
                  <div className="text-emerald-400 text-[11px]">
                    Voter can verify their ballot is in the tally (Tracker ID + Merkle Proof).
                  </div>
                  
                  <div className="text-slate-300 font-semibold font-sans pt-2 border-t border-slate-800">
                    Receipt-Freeness:
                  </div>
                  <div className="text-rose-400 text-[11px]">
                    Voter CANNOT prove to an extorting boss who they voted for.
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-normal">
                  VoteShield achieves this balance by issuing receipts with Tracker IDs and Merkle Proofs that verify <strong>inclusion of the encrypted envelope</strong>, but do NOT print the plaintext candidate choice!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
