import React, { useState } from 'react';
import { ElectionProvider } from './context/ElectionContext';
import Header from './components/Header';
import Navigation from './components/Navigation';
import KioskView from './components/Kiosk/KioskView';
import LedgerView from './components/Ledger/LedgerView';
import ResultsView from './components/Results/ResultsView';
import AdversarialLab from './components/Adversarial/AdversarialLab';
import VotersView from './components/Voters/VotersView';
import GuideView from './components/Guide/GuideView';
import AuditReportModal from './components/Modals/AuditReportModal';
import { ShieldCheck, Cpu, Lock, Github, Heart } from 'lucide-react';

function AppContent() {
  const [activeTab, setActiveTab] = useState('kiosk');
  const [auditTracker, setAuditTracker] = useState('');
  const [isReportOpen, setIsReportOpen] = useState(false);

  const handleAuditReceipt = (receipt) => {
    setAuditTracker(receipt.trackerId);
    setActiveTab('ledger');
  };

  const handleSelectVoterForKiosk = (voterId) => {
    setActiveTab('kiosk');
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Application Bar */}
      <Header onOpenReport={() => setIsReportOpen(true)} />

      {/* Main Tab Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {activeTab === 'kiosk' && (
          <KioskView onAuditReceipt={handleAuditReceipt} />
        )}

        {activeTab === 'ledger' && (
          <LedgerView initialAuditedTracker={auditTracker} />
        )}

        {activeTab === 'results' && (
          <ResultsView onOpenReport={() => setIsReportOpen(true)} />
        )}

        {activeTab === 'adversarial' && (
          <AdversarialLab />
        )}

        {activeTab === 'voters' && (
          <VotersView onSelectVoterForKiosk={handleSelectVoterForKiosk} />
        )}

        {activeTab === 'guide' && (
          <GuideView />
        )}
      </main>

      {/* Verifiable Election Audit Certificate Modal */}
      <AuditReportModal 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />

      {/* Application Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 text-xs text-slate-500 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-300">VoteShield AI Simulator</span>
            <span>•</span>
            <span>Offline-First Digital Voting & Verifiable Cryptography</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              Air-Gapped Client SHA-256
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Edge AI Liveness Detection
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ElectionProvider>
      <AppContent />
    </ElectionProvider>
  );
}
