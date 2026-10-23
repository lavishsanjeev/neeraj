import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Printer, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  QrCode, 
  Copy, 
  Check,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function ReceiptModal({ receipt, onClose, onAuditReceipt }) {
  const [copied, setCopied] = useState(false);

  if (!receipt) return null;

  const handleCopyTracker = () => {
    navigator.clipboard.writeText(receipt.trackerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `VoteShield_Receipt_${receipt.trackerId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative my-8">
        
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Ballot Cryptographically Committed!
          </h3>
          <p className="text-xs text-slate-400">
            Your encrypted vote has been included in the offline Merkle tree audit ledger.
          </p>
        </div>

        {/* Paper Receipt Simulation Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between border-b border-dashed border-slate-800 pb-3">
            <div>
              <div className="font-bold text-white tracking-wider">VOTESHIELD AUDIT RECEIPT</div>
              <div className="text-[10px] text-slate-500">FACULTY ELECTION 2026</div>
            </div>
            <div className="text-right">
              <span className="text-emerald-400 font-bold">{receipt.receiptId}</span>
              <div className="text-[10px] text-slate-500">{new Date(receipt.timestamp).toLocaleTimeString()}</div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <div className="text-[10px] text-slate-500 uppercase">Ballot Tracker ID (Public):</div>
              <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold select-all">{receipt.trackerId}</span>
                <button
                  onClick={handleCopyTracker}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Tracker ID"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase">Merkle Leaf Index & Hash:</div>
              <div className="text-slate-300 text-[11px] truncate bg-slate-900/60 p-1.5 rounded">
                Leaf #{receipt.leafIndex}: {receipt.leafHash}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase">Committed Merkle Root:</div>
              <div className="text-emerald-300 text-[11px] truncate bg-slate-900/60 p-1.5 rounded">
                {receipt.merkleRoot}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase">Nullifier Token (Spent):</div>
              <div className="text-purple-300 text-[11px] truncate bg-slate-900/60 p-1.5 rounded">
                {receipt.nullifier}
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-500 uppercase">Merkle Proof Steps ({receipt.proof?.length || 0} siblings):</div>
              <div className="text-slate-400 text-[10px] max-h-16 overflow-y-auto space-y-0.5 bg-slate-900/40 p-1.5 rounded">
                {receipt.proof?.map((p, idx) => (
                  <div key={idx} className="truncate">
                    Step {idx + 1} [{p.position}]: {p.hash.substring(0, 24)}...
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code Graphic Mockup */}
          <div className="pt-3 border-t border-dashed border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <QrCode className="w-8 h-8 text-cyan-400" />
              <div className="text-[10px] leading-tight">
                <span className="text-slate-300 block font-sans font-semibold">Zero-Knowledge Verification</span>
                Scan or paste tracker ID in Audit Ledger to verify inclusion
              </div>
            </div>
            <div className="text-[10px] text-slate-500 text-right">
              SHA-256 Validated
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON Receipt</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAuditReceipt(receipt);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-900/40 cursor-pointer transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit This Ballot in Ledger</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-colors"
            >
              Done / New Voter
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
