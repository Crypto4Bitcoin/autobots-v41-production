'use client';
import { useEconomyStore } from '../../stores/economyStore';
import { useEffect } from 'react';

export default function IRSUnderground() {
  const irsPulses = useEconomyStore((s) => s.irsPulses);
  const removeIRSPulse = useEconomyStore((s) => s.removeIRSPulse);

  // Auto-remove pulses after explosion animation
  useEffect(() => {
    if (irsPulses.length === 0) return;
    
    const timeouts = irsPulses.map((pulse) => {
      return setTimeout(() => {
        removeIRSPulse(pulse.id);
      }, 2500); // Pulse lasts 2.5s
    });

    return () => timeouts.forEach(clearTimeout);
  }, [irsPulses, removeIRSPulse]);

  return (
    <div className="absolute inset-0 pointer-events-none z-15">
      {irsPulses.map((pulse) => (
        <div
          key={pulse.id}
          className="absolute z-20 pointer-events-none"
          style={{ left: `${pulse.x}%`, top: `${pulse.y}%` }}
        >
          {/* Shockwave */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/80 bg-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.5)] animate-ping" style={{ width: '80px', height: '80px', animationDuration: '2s' }} />
          
          {/* Audit Text */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-12 whitespace-nowrap text-center animate-bounce">
            <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">
              IRS AUDIT
            </span>
            <span className="mt-0.5 block text-xs font-bold text-white">
              -${pulse.amount} EXTRACTED
            </span>
          </div>

          {/* Line to Citadel */}
          <svg className="absolute top-1/2 left-1/2 overflow-visible" style={{ width: 1, height: 1 }}>
            <line
              x1="0"
              y1="0"
              x2={`calc(50vw - ${pulse.x}vw)`}
              y2={`calc(50vh - ${pulse.y}vh)`}
              stroke="url(#irsGradient)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-pulse"
            />
            <defs>
              <linearGradient id="irsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(239,68,68,0.8)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0.2)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      ))}
      
      {/* Background Under-grid when active pulses exist */}
      {irsPulses.length > 0 && (
        <div className="absolute inset-0 bg-red-900/5 mix-blend-color-burn transition duration-1000" />
      )}
    </div>
  );
}
