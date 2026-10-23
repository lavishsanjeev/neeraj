import React, { useState, useEffect, useRef } from 'react';
import { 
  ScanFace, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  Eye, 
  Activity, 
  Cpu, 
  UserCheck,
  Smartphone
} from 'lucide-react';

export default function BiometricAuth({ selectedVoter, onAuthenticated }) {
  const [simulationMode, setSimulationMode] = useState('genuine'); // 'genuine' | 'photo-spoof' | 'adversarial'
  const [scanningState, setScanningState] = useState('idle'); // 'idle' | 'scanning' | 'passed' | 'failed'
  const [scanProgress, setScanProgress] = useState(0);
  const [livenessMetrics, setLivenessMetrics] = useState({
    depthDisparity: 0.91,
    skinTextureScore: 0.94,
    blinkDetected: true,
    specularAnomaly: false,
    aiConfidence: 0.96
  });

  const canvasRef = useRef(null);

  // Animate biometric scan lines on canvas
  useEffect(() => {
    let animationFrame;
    let step = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (scanningState === 'scanning') {
        step += 0.04;
        const scanY = (Math.sin(step) * 0.5 + 0.5) * canvas.height;

        // Laser scan line
        const grad = ctx.createLinearGradient(0, scanY - 10, 0, scanY + 10);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        grad.addColorStop(0.5, simulationMode === 'genuine' ? 'rgba(6, 182, 212, 0.9)' : 'rgba(244, 63, 94, 0.9)');
        grad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = grad;
        ctx.fillRect(20, scanY - 8, canvas.width - 40, 16);

        // Target reticles
        ctx.strokeStyle = simulationMode === 'genuine' ? 'rgba(6, 182, 212, 0.6)' : 'rgba(244, 63, 94, 0.6)';
        ctx.lineWidth = 1.5;

        // Face oval guideline
        ctx.beginPath();
        ctx.ellipse(canvas.width / 2, canvas.height / 2, 70, 95, 0, 0, 2 * Math.PI);
        ctx.stroke();

        // Feature landmark points
        const points = [
          [canvas.width / 2 - 25, canvas.height / 2 - 15], // left eye
          [canvas.width / 2 + 25, canvas.height / 2 - 15], // right eye
          [canvas.width / 2, canvas.height / 2 + 8],       // nose bridge
          [canvas.width / 2 - 20, canvas.height / 2 + 35], // mouth left
          [canvas.width / 2 + 20, canvas.height / 2 + 35], // mouth right
          [canvas.width / 2, canvas.height / 2 + 45],      // chin
        ];

        points.forEach(([x, y]) => {
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, 2 * Math.PI);
          ctx.fillStyle = simulationMode === 'genuine' ? '#38bdf8' : '#fb7185';
          ctx.fill();
        });
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrame);
  }, [scanningState, simulationMode]);

  // Handle scan execution
  const startVerificationScan = () => {
    setScanningState('scanning');
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          finalizeScan();
          return 100;
        }
        return prev + 10;
      });
    }, 120);
  };

  const finalizeScan = () => {
    if (simulationMode === 'genuine') {
      const genuineMetrics = {
        depthDisparity: 0.93,
        skinTextureScore: 0.95,
        blinkDetected: true,
        specularAnomaly: false,
        aiConfidence: 0.97
      };
      setLivenessMetrics(genuineMetrics);
      setScanningState('passed');
      onAuthenticated({
        status: 'VERIFIED',
        metrics: genuineMetrics,
        mode: 'genuine'
      });
    } else if (simulationMode === 'photo-spoof') {
      const spoofMetrics = {
        depthDisparity: 0.18, // flat planar surface detected!
        skinTextureScore: 0.32, // moiré print artifact!
        blinkDetected: false,
        specularAnomaly: true, // glass reflection
        aiConfidence: 0.28 // below 0.80 cutoff
      };
      setLivenessMetrics(spoofMetrics);
      setScanningState('failed');
    } else if (simulationMode === 'adversarial') {
      const advMetrics = {
        depthDisparity: 0.72,
        skinTextureScore: 0.75,
        blinkDetected: true,
        specularAnomaly: false,
        aiConfidence: 0.61 // perturbed embedding
      };
      setLivenessMetrics(advMetrics);
      setScanningState('failed');
    }
  };

  const resetScan = () => {
    setScanningState('idle');
    setScanProgress(0);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            Edge AI Biometric & Liveness Verification
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Offline 128-dimensional embedding model running purely client-side inside the kiosk sandbox.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs text-slate-300 font-mono">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Threshold: 0.80 Liveness</span>
        </div>
      </div>

      {/* Main Viewfinder & Scan Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left: Interactive Simulated Camera Frame */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[280px] aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 border-2 border-slate-700 shadow-2xl flex flex-col items-center justify-center">
            
            {/* Background representation of user / avatar */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
              <span className="text-7xl filter drop-shadow select-none">
                {selectedVoter?.avatar || '🧑‍💻'}
              </span>
              <span className="text-xs font-mono text-slate-400 mt-2">
                {selectedVoter?.name || 'Voter Profile'}
              </span>

              {/* Mode indicator badge overlay */}
              {simulationMode === 'photo-spoof' && (
                <div className="absolute top-3 left-3 right-3 bg-rose-950/90 border border-rose-600 rounded px-2 py-1 flex items-center justify-center gap-1.5 text-[11px] text-rose-300 font-mono">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>2D Printed Photo / Screen Spoof</span>
                </div>
              )}
            </div>

            {/* Canvas for scanning lines and landmark points */}
            <canvas 
              ref={canvasRef} 
              width={280} 
              height={370} 
              className="absolute inset-0 z-10 pointer-events-none"
            />

            {/* Status Overlay */}
            {scanningState === 'passed' && (
              <div className="absolute inset-0 z-20 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-400 animate-bounce" />
                <span className="text-base font-bold text-white mt-2">Liveness Verified!</span>
                <span className="text-xs text-emerald-300 font-mono mt-1">
                  Confidence: {(livenessMetrics.aiConfidence * 100).toFixed(1)}%
                </span>
                <span className="text-[11px] text-slate-300 mt-2 px-2 py-1 bg-emerald-900/60 rounded border border-emerald-700/60">
                  Biometric Vector Match: Confirmed
                </span>
              </div>
            )}

            {scanningState === 'failed' && (
              <div className="absolute inset-0 z-20 bg-rose-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <AlertTriangle className="w-14 h-14 text-rose-400 animate-pulse" />
                <span className="text-base font-bold text-rose-200 mt-2">Presentation Attack Detected!</span>
                <span className="text-xs text-rose-300 font-mono mt-1">
                  Confidence: {(livenessMetrics.aiConfidence * 100).toFixed(1)}% (Cutoff: 80%)
                </span>
                <span className="text-[11px] text-rose-300/90 mt-2 px-2 py-1 bg-rose-900/60 rounded border border-rose-700/60">
                  Reason: Flat depth profile & specular glare
                </span>
              </div>
            )}

            {/* Corner Framing Markers */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400 pointer-events-none"></div>
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400 pointer-events-none"></div>
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400 pointer-events-none"></div>
          </div>

          {/* Trigger Scan Button */}
          <div className="w-full max-w-[280px] mt-3">
            {scanningState === 'idle' && (
              <button
                onClick={startVerificationScan}
                className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 font-semibold text-white text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/40 cursor-pointer transition-all"
              >
                <ScanFace className="w-4 h-4" />
                <span>Run Biometric Liveness Scan</span>
              </button>
            )}

            {scanningState === 'scanning' && (
              <div className="space-y-1.5">
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-cyan-400 h-2 transition-all duration-100"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="text-center font-mono text-xs text-cyan-400 animate-pulse">
                  Extracting feature embeddings... {scanProgress}%
                </div>
              </div>
            )}

            {(scanningState === 'passed' || scanningState === 'failed') && (
              <button
                onClick={resetScan}
                className="w-full py-2 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Rescan / Change Mode</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Security Simulation Controller & Metrics */}
        <div className="md:col-span-6 space-y-4">
          
          {/* Attack Simulation Selector */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              Instructor Test: Biometric Input Condition
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setSimulationMode('genuine'); resetScan(); }}
                className={`p-2 rounded border text-left cursor-pointer transition-all ${
                  simulationMode === 'genuine'
                    ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Genuine Live Voter
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">3D facial depth & natural blink</div>
              </button>

              <button
                type="button"
                onClick={() => { setSimulationMode('photo-spoof'); resetScan(); }}
                className={`p-2 rounded border text-left cursor-pointer transition-all ${
                  simulationMode === 'photo-spoof'
                    ? 'bg-rose-950/70 border-rose-500 text-rose-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  Presentation Spoof
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">2D photo or tablet screen replay</div>
              </button>
            </div>
          </div>

          {/* Real-time Metric Breakdown */}
          <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-lg p-3.5 text-xs font-mono">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-sans font-semibold">
              Edge AI Telemetry (Local Model)
            </span>

            <div className="space-y-2 pt-1">
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>3D Pupil Depth Disparity:</span>
                  <span className={livenessMetrics.depthDisparity > 0.8 ? 'text-emerald-400' : 'text-rose-400'}>
                    {(livenessMetrics.depthDisparity * 100).toFixed(0)}% {livenessMetrics.depthDisparity > 0.8 ? '(Live 3D)' : '(Flat 2D)'}
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${livenessMetrics.depthDisparity > 0.8 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${livenessMetrics.depthDisparity * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300">
                  <span>High-Freq Skin Texture Harmonics:</span>
                  <span className={livenessMetrics.skinTextureScore > 0.8 ? 'text-emerald-400' : 'text-rose-400'}>
                    {(livenessMetrics.skinTextureScore * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-1">
                  <div 
                    className={`h-1.5 rounded-full ${livenessMetrics.skinTextureScore > 0.8 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                    style={{ width: `${livenessMetrics.skinTextureScore * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="text-slate-400">Specular Reflection Anomaly:</span>
                <span className={livenessMetrics.specularAnomaly ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {livenessMetrics.specularAnomaly ? 'Detected (Screen Glare)' : 'None (Natural Diffuse)'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Micro-Blink Liveness Challenge:</span>
                <span className={livenessMetrics.blinkDetected ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {livenessMetrics.blinkDetected ? 'Passed (Dynamic)' : 'Failed (Static Frame)'}
                </span>
              </div>
            </div>
          </div>

          {/* Privacy & Edge AI Architecture Note */}
          <div className="p-2.5 rounded bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200/90 leading-relaxed">
            <strong>Offline-First Privacy Guarantee:</strong> The raw image from this kiosk camera never leaves local volatile RAM. It is immediately vectorized into a non-invertible 128-d cosine embedding and purged from memory.
          </div>

        </div>

      </div>

    </div>
  );
}
