import React, { useState } from 'react';
import { LAB_EXERCISES } from '../../utils/mockData';
import { 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  Square, 
  HelpCircle, 
  Code2, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Key, 
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function GuideView() {
  const [completedSteps, setCompletedSteps] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});

  const toggleStep = (labId, stepIdx) => {
    const key = `${labId}-${stepIdx}`;
    setCompletedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSolution = (labId) => {
    setRevealedSolutions(prev => ({ ...prev, [labId]: !prev[labId] }));
  };

  const solutions = {
    'lab-1': {
      answer: 'The Election Salt acts as a domain separator. If the salt were reused across elections, an adversary tracking published nullifiers across elections could link that the voter in Election 1 was the exact same person who voted in Election 2 (linkability attack), destroying longitudinal anonymity. Furthermore, a fresh salt prevents precomputation and rainbow table attacks against voter secrets.',
      rubric: 'Full marks: Identifies cross-election linkability and domain separation.'
    },
    'lab-2': {
      answer: 'For N = 1,000,000 ballots, a balanced binary Merkle Tree requires exactly ceil(log2(1,000,000)) = 20 hash computations! Instead of verifying all 1,000,000 leaves, the voter only needs 20 sibling hashes to prove their vote is included in the root. This is why Merkle Trees scale to millions of participants on edge devices.',
      rubric: 'Full marks: Correctly calculates ceil(log2(1,000,000)) = 20 hashes.'
    },
    'lab-3': {
      answer: 'Offline edge face verification protects civil liberties because students\' sensitive biological templates never transit a network or get stored in a centralized surveillance database. However, without expensive active 3D structured-light cameras or server-grade computing power, lightweight offline neural networks have higher vulnerability to 2D screen replays, paper cutouts, and subtle gradient evasion attacks.',
      rubric: 'Full marks: Explains privacy preservation vs. physical sensor constraints.'
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">
              <GraduationCap className="w-3.5 h-3.5" />
              Academic Curriculum & Lab Manual
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Engineering Lab Manual & Architecture Guide
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Curated laboratory exercises and architectural formalisms for engineering instructors and students examining zero-knowledge cryptographic nullifiers, Merkle verification, and edge AI security.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 shrink-0">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>3 Interactive Lab Exercises</span>
          </div>
        </div>
      </div>

      {/* Mathematical Foundations & Formula Reference */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Math 1: Nullifier */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs">
          <div className="text-cyan-400 font-bold flex items-center gap-1.5 font-sans">
            <Key className="w-4 h-4" />
            1. ZK Nullifier Formula
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-200">
            Nullifier = SHA256(s_v || Salt)
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Deterministic one-way token that destroys identity linkability while preserving single-vote enforcement.
          </p>
        </div>

        {/* Math 2: Merkle Avalanche */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs">
          <div className="text-emerald-400 font-bold flex items-center gap-1.5 font-sans">
            <Layers className="w-4 h-4" />
            2. Merkle Tree Recurrence
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-200">
            H_parent = SHA256(H_L || H_R)
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Cascading hash tree where any 1-bit alteration in any leaf invalidates the root with probability 1 - 2^-256.
          </p>
        </div>

        {/* Math 3: Cosine Similarity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs">
          <div className="text-purple-400 font-bold flex items-center gap-1.5 font-sans">
            <Cpu className="w-4 h-4" />
            3. AI Cosine Similarity
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-200">
            cos(&theta;) = (u &middot; v) / (||u|| ||v||)
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Compares 128-dimensional biometric embeddings in unit hyperspace. Threshold: cos(&theta;) &ge; 0.80.
          </p>
        </div>

        {/* Math 4: Envelope Encryption */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 font-mono text-xs">
          <div className="text-amber-400 font-bold flex items-center gap-1.5 font-sans">
            <Code2 className="w-4 h-4" />
            4. Envelope Encryption
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-200">
            C = Enc_pk(Payload || IV)
          </div>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Voter choices sealed client-side before recording. Only decrypted at the public tally ceremony.
          </p>
        </div>

      </div>

      {/* Lab Exercises Interactive Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Interactive Hands-on Laboratory Exercises
        </h3>

        {LAB_EXERCISES.map((lab, index) => {
          const solution = solutions[lab.id];
          const isRevealed = revealedSolutions[lab.id];

          return (
            <div key={lab.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold tracking-wider">
                    Experiment 0{index + 1}
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">
                    {lab.title}
                  </h4>
                </div>

                <div className="text-xs font-mono text-slate-400">
                  Target: Cybersecurity & AI Principles
                </div>
              </div>

              {/* Objective */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <strong className="text-cyan-300 block mb-1">Learning Objective:</strong>
                <p className="text-slate-300 leading-relaxed">{lab.objective}</p>
              </div>

              {/* Step by Step Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Procedure & Verification Steps:
                </span>
                
                <div className="space-y-2 pt-1">
                  {lab.steps.map((stepText, sIdx) => {
                    const isDone = completedSteps[`${lab.id}-${sIdx}`];

                    return (
                      <div
                        key={sIdx}
                        onClick={() => toggleStep(lab.id, sIdx)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors text-xs ${
                          isDone 
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-slate-200' 
                            : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <span className={isDone ? 'line-through text-slate-400' : ''}>
                          Step {sIdx + 1}: {stepText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Discussion Question & Solution */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-amber-200">
                  <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-sans">Instructor Discussion Question:</strong>
                    <p className="mt-1 text-slate-300 leading-relaxed">{lab.discussionQuestion}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => toggleSolution(lab.id)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{isRevealed ? 'Hide Instructor Answer & Grading Rubric' : 'Show Instructor Answer & Grading Rubric'}</span>
                    {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {isRevealed && solution && (
                    <div className="mt-3 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-xs text-cyan-200 space-y-2">
                      <div>
                        <strong className="text-white block">Model Solution:</strong>
                        <p className="leading-relaxed text-cyan-100">{solution.answer}</p>
                      </div>
                      <div className="pt-2 border-t border-cyan-900/80 text-[11px] text-cyan-300 font-mono">
                        Grading Rubric: {solution.rubric}
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Comparative Security Architecture Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          Comparative Analysis: Paper vs. Cloud E-Voting vs. VoteShield AI
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Evaluation Metric</th>
                <th className="py-3 px-4">Paper Ballots</th>
                <th className="py-3 px-4">Cloud E-Voting</th>
                <th className="py-3 px-4 text-cyan-400">VoteShield AI (Air-Gapped)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              <tr>
                <td className="py-3 px-4 font-bold text-white">Ballot Secrecy</td>
                <td className="py-3 px-4 text-emerald-400">High (physical booth)</td>
                <td className="py-3 px-4 text-amber-400">Vulnerable to server logs</td>
                <td className="py-3 px-4 text-cyan-300 font-bold">Mathematical (Nullifier + Envelope)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Duplicate Vote Prevention</td>
                <td className="py-3 px-4 text-slate-300">Indelible ink / checklist</td>
                <td className="py-3 px-4 text-slate-300">Central DB primary key</td>
                <td className="py-3 px-4 text-cyan-300 font-bold">O(1) Cryptographic Nullifiers</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Individual Verifiability</td>
                <td className="py-3 px-4 text-rose-400">None (drops in black box)</td>
                <td className="py-3 px-4 text-amber-400">Requires trusting cloud TLS</td>
                <td className="py-3 px-4 text-cyan-300 font-bold">O(log N) Merkle Sibling Proofs</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Tamper Evidence</td>
                <td className="py-3 px-4 text-amber-400">Physical box seals</td>
                <td className="py-3 px-4 text-rose-400">Silent insider DB modification</td>
                <td className="py-3 px-4 text-cyan-300 font-bold">Instant Root Avalanche Alert</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-white">Air-Gapped Local Operation</td>
                <td className="py-3 px-4 text-emerald-400">100% Offline</td>
                <td className="py-3 px-4 text-rose-400">0% (Requires Internet / Cloud)</td>
                <td className="py-3 px-4 text-cyan-300 font-bold">100% Offline (Local Browser RAM)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
