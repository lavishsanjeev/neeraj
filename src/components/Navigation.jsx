import React from 'react';
import { 
  Vote, 
  Database, 
  BarChart3, 
  FlaskConical, 
  Users, 
  GraduationCap 
} from 'lucide-react';
import { useElection } from '../context/ElectionContext';

export default function Navigation({ activeTab, setActiveTab }) {
  const { ballots, voters, isLedgerCompromised } = useElection();

  const tabs = [
    {
      id: 'kiosk',
      label: 'Voting Kiosk',
      subtitle: 'AI Face Auth & Cast',
      icon: Vote,
      badge: null
    },
    {
      id: 'ledger',
      label: 'Cryptographic Ledger',
      subtitle: 'Merkle Tree & Tamper Lab',
      icon: Database,
      badge: isLedgerCompromised ? 'TAMPERED' : `${ballots.length} leaves`,
      badgeColor: isLedgerCompromised ? 'bg-rose-900 text-rose-200 border-rose-700' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
    },
    {
      id: 'results',
      label: 'Instant Results',
      subtitle: 'Live Tally & Ceremony',
      icon: BarChart3,
      badge: `${ballots.length} votes`,
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800'
    },
    {
      id: 'adversarial',
      label: 'Adversarial Lab',
      subtitle: 'Controls vs. Limitations',
      icon: FlaskConical,
      badge: '5 Attacks',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800'
    },
    {
      id: 'voters',
      label: 'Electoral Roll',
      subtitle: 'Voter Directory & Nullifiers',
      icon: Users,
      badge: `${voters.filter(v => v.hasVoted).length}/${voters.length}`,
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800'
    },
    {
      id: 'guide',
      label: 'Engineering Guide',
      subtitle: 'Architecture & Lab Tasks',
      icon: GraduationCap,
      badge: 'Labs',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700'
    }
  ];

  return (
    <nav className="border-b border-slate-800/80 bg-slate-900/60 sticky top-[57px] z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs sm:text-sm">{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
