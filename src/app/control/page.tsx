'use client';

import React from 'react';
import { RegulationPanel } from '@/components/RegulationPanel';
import { SovereignMonitor } from '@/components/SovereignMonitor';
import Link from 'next/link';
import { ShieldCheck, Activity, Terminal } from 'lucide-react';

export default function ControlPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-slate-800 pb-8 gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter text-slate-100 flex items-center gap-4">
              AUTOBOTS MASTER CONTROL
              <span className="bg-emerald-950 text-emerald-400 text-[10px] px-3 py-1 rounded-full border border-emerald-800 uppercase font-black tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                SOVEREIGN V4
              </span>
            </h1>
            <div className="flex items-center gap-4">
              <p className="text-slate-500 text-[11px] font-mono uppercase tracking-[0.3em] flex items-center gap-2">
                <Terminal className="w-3 h-3" />
                Integrated 3-6-9 Rhythm Engine
              </p>
              <div className="w-1 h-1 rounded-full bg-slate-800" />
              <p className="text-slate-500 text-[11px] font-mono uppercase tracking-[0.3em]">
                Regulation Brain V1.4
              </p>
            </div>
          </div>
          <Link 
            href="/academy" 
            className="group flex items-center gap-3 text-[10px] bg-slate-900/50 hover:bg-slate-800 border border-slate-800 px-6 py-3 rounded uppercase font-black tracking-widest transition-all duration-300 hover:border-slate-600 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            RETURN TO ACADEMY
            <Activity className="w-3 h-3 text-slate-600 group-hover:text-emerald-400 transition-colors" />
          </Link>
        </div>

        <div className="space-y-16">
            {/* Real-time Sovereign Monitoring */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        LIVE PRODUCTION MONITOR
                    </h3>
                    <span className="text-[10px] text-slate-700 font-mono">IDLE POSTURE // STAGED</span>
                </div>
                <SovereignMonitor />
            </div>

            {/* Regulation & Rhythm Controls */}
            <div className="space-y-6 pt-8 border-t border-slate-900">
                 <h3 className="text-sm font-black text-slate-300 uppercase tracking-[0.5em] flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    SOVEREIGN REGULATION POSTURE
                </h3>
                <RegulationPanel />
            </div>
        </div>

        <div className="flex flex-col items-center justify-center pt-24 pb-12 gap-4">
            <p className="text-[10px] text-slate-800 uppercase tracking-[1em] font-black">
                Designated Galactic Infrastructure // Infinity Loop Locked
            </p>
            <div className="flex gap-2">
                <div className="w-8 h-[1px] bg-slate-900" />
                <div className="w-1 h-1 rounded-full bg-slate-800" />
                <div className="w-8 h-[1px] bg-slate-900" />
            </div>
        </div>
      </div>
    </div>
  );
}
