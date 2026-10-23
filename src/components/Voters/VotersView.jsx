import React, { useState } from 'react';
import { useElection } from '../../context/ElectionContext';
import { generateNullifier } from '../../utils/crypto';
import { 
  Users, 
  Search, 
  UserPlus, 
  Key, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Copy, 
  Check, 
  ArrowRight,
  Vote,
  Sparkles
} from 'lucide-react';

export default function VotersView({ onSelectVoterForKiosk }) {
  const { voters, spentNullifiers, metadata, addCustomVoter } = useElection();

  const [searchTerm, setSearchTerm] = useState('');
  const [revealedKeys, setRevealedKeys] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // New voter form state
  const [newVoterName, setNewVoterName] = useState('');
  const [newVoterDept, setNewVoterDept] = useState('Computer Science & Cybersecurity');
  const [newVoterAvatar, setNewVoterAvatar] = useState('🧑‍🎓');

  const toggleRevealKey = (id) => {
    setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEnrollSubmit = (e) => {
    e.preventDefault();
    if (!newVoterName.trim()) return;

    addCustomVoter({
      name: newVoterName.trim(),
      department: newVoterDept,
      avatar: newVoterAvatar
    });

    setNewVoterName('');
    setShowAddModal(false);
  };

  const filteredVoters = voters.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const spentEntries = Object.entries(spentNullifiers);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-mono">
              <Users className="w-3.5 h-3.5" />
              Electoral Directory & Identity Vault
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Electoral Roll & Nullifier Registry
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Verify registered students, inspect deterministic zero-knowledge nullifiers, and audit the public Spent Nullifier registry which enforces single-ballot voting.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 font-semibold text-white text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-950/40 transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        </div>

        {/* Search Bar & Stats */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              Total Enrolled: <strong className="text-white">{voters.length}</strong>
            </span>
            <span className="px-3 py-2 bg-slate-950 rounded-lg border border-slate-800 text-slate-300">
              Ballots Cast: <strong className="text-emerald-400">{voters.filter(v => v.hasVoted).length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Voter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVoters.map((voter) => {
          const isRevealed = revealedKeys[voter.id];
          const voterNullifier = generateNullifier(voter.secretKey, metadata.electionSalt);
          const isSpent = Boolean(spentNullifiers[voterNullifier]);

          return (
            <div 
              key={voter.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all ${
                voter.hasVoted ? 'border-slate-800 bg-slate-900/60' : 'border-slate-800 hover:border-purple-500/50'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl bg-slate-950 p-2 rounded-xl border border-slate-800 select-none">
                    {voter.avatar}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white text-sm flex items-center gap-1.5">
                      <span>{voter.name}</span>
                    </h3>
                    <p className="text-xs text-purple-300 font-mono">{voter.studentId}</p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{voter.department}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border shrink-0 ${
                  voter.hasVoted 
                    ? 'bg-purple-950 text-purple-300 border-purple-800' 
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {voter.hasVoted ? 'BALLOT CAST' : 'ELIGIBLE'}
                </span>
              </div>

              {/* Private Voter Secret Key */}
              <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-cyan-400" />
                    Private Key (Client Only):
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleRevealKey(voter.id)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title={isRevealed ? 'Hide Secret Key' : 'Reveal Secret Key'}
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded border border-slate-800 text-slate-300">
                  <span className="truncate max-w-[200px]">
                    {isRevealed ? voter.secretKey : '••••••••••••••••••••••••'}
                  </span>
                  {isRevealed && (
                    <button
                      onClick={() => copyToClipboard(voter.secretKey, voter.id)}
                      className="text-slate-400 hover:text-white cursor-pointer ml-1"
                      title="Copy Secret"
                    >
                      {copiedKey === voter.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-slate-800/80">
                  <div className="text-[10px] text-slate-500 uppercase">Deterministic Nullifier:</div>
                  <div className="text-cyan-400 truncate max-w-[240px]" title={voterNullifier}>
                    {voterNullifier.substring(0, 16)}...
                  </div>
                </div>
              </div>

              {/* Quick Action Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onSelectVoterForKiosk(voter.id)}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-200 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Vote className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{voter.hasVoted ? 'Attempt Re-Vote (Test Protection)' : 'Vote as This Student'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spent Nullifiers Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Public Spent Nullifiers Registry ({spentEntries.length} spent tokens)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            State: O(1) Duplicate Rejection
          </span>
        </div>

        {spentEntries.length === 0 ? (
          <div className="text-center py-6 text-slate-500 font-mono text-xs">
            Registry is empty. No ballots committed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Spent Nullifier Token</th>
                  <th className="py-2.5 px-4">Tracker ID</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {spentEntries.map(([nullifier, data]) => (
                  <tr key={nullifier} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 text-purple-300 font-bold truncate max-w-[200px]" title={nullifier}>
                      {nullifier}
                    </td>
                    <td className="py-2.5 px-4 text-cyan-300">
                      {data.trackerId}
                    </td>
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(data.timestamp).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
                        SPENT (LOCKED)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Voter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" />
                Enroll New Student Voter
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Student Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Alex Chen"
                  value={newVoterName}
                  onChange={(e) => setNewVoterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Department:</label>
                <select
                  value={newVoterDept}
                  onChange={(e) => setNewVoterDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white cursor-pointer"
                >
                  <option value="Computer Science & Cybersecurity">Computer Science & Cybersecurity</option>
                  <option value="Electrical & Computer Engineering">Electrical & Computer Engineering</option>
                  <option value="Artificial Intelligence & Robotics">Artificial Intelligence & Robotics</option>
                  <option value="Quantum Computing & Information">Quantum Computing & Information</option>
                  <option value="Software Systems & Cloud Architecture">Software Systems & Cloud Architecture</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Avatar Icon:</label>
                <div className="flex items-center gap-2">
                  {['🧑‍🎓', '👩‍🔬', '👨‍💻', '👩‍💻', '🧑‍🔧', '👨‍🏫'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewVoterAvatar(emoji)}
                      className={`text-2xl p-2 rounded-lg border cursor-pointer ${
                        newVoterAvatar === emoji ? 'bg-purple-950 border-purple-500' : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold cursor-pointer shadow-lg shadow-purple-950/40"
                >
                  Generate Credentials & Enroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
