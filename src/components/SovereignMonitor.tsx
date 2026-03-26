'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Database, MessageSquare, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

export const SovereignMonitor: React.FC = () => {
  const [health, setHealth] = useState<{ status: string; state: string } | null>(null);
  const [dbData, setDbData] = useState<{ divCount: number; latestEvent: any; latestJob: any } | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      // 1. Health
      const hRes = await fetch('/api/health');
      const hData = await hRes.json();
      setHealth(hData);

      // 2. Secured DB Status
      const sRes = await fetch('/api/control/status');
      const sData = await sRes.json();
      setDbData(sData);

    } catch (e) {
      console.error("Monitor refresh failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const divCount = dbData?.divCount || 0;
  const latestEvent = dbData?.latestEvent;
  const latestJob = dbData?.latestJob;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8">
      {/* Edge Health */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
           <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
             <Activity className="w-3 h-3 text-emerald-500" />
             Edge Health
           </h4>
           <span className={clsx("text-[10px] px-2 py-0.5 rounded font-black", 
              health?.status === 'healthy' ? "bg-emerald-900/50 text-emerald-400 border border-emerald-500" : "bg-red-900/50 text-red-400 border border-red-500"
           )}>
             {health?.status || 'OFFLINE'}
           </span>
        </div>
        <div className="space-y-1">
           <p className="text-2xl font-black text-slate-100 tracking-tighter">{health?.state || '???'}</p>
           <p className="text-[10px] text-slate-500 uppercase">Current Production Posture</p>
        </div>
      </div>

      {/* DB Spine */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
           <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
             <Database className="w-3 h-3 text-blue-500" />
             DB Spine
           </h4>
           <span className="text-[10px] text-slate-400 font-mono">{divCount}/19 DIVISIONS</span>
        </div>
        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
           <div 
             className="bg-blue-600 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
             style={{ width: `${(divCount / 19) * 100}%` }}
           />
        </div>
        <p className="text-[10px] text-slate-500 uppercase">Registry Ignition Status</p>
      </div>

      {/* Telegram Bridge */}
      <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-xl space-y-4 col-span-1 md:col-span-2">
         <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-[10px] text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
              <MessageSquare className="w-3 h-3 text-indigo-500" />
              Telegram Round-Trip Audit
            </h4>
            <div className="flex items-center gap-4">
                {loading && <div className="w-1 h-1 rounded-full bg-indigo-500 animate-ping" />}
                <button onClick={refresh} className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-widest">Force Sync</button>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
                <p className="text-[10px] text-slate-600 uppercase font-bold">Latest Inbound</p>
                {latestEvent ? (
                    <div className="bg-black p-3 rounded border border-slate-800 font-mono text-[11px] text-slate-400 group hover:border-slate-600 transition-colors">
                        <span className="text-emerald-500">[{latestEvent.event_type.toUpperCase()}]</span> {latestEvent.raw_payload?.message?.text || 'CALLBACK'}
                        <p className="text-[9px] text-slate-700 mt-1 uppercase">ID: {latestEvent.id}</p>
                    </div>
                ) : (
                    <p className="text-[11px] text-slate-800 italic font-mono uppercase tracking-tighter">Waiting for first message update...</p>
                )}
            </div>
            <div className="space-y-2">
                <p className="text-[10px] text-slate-600 uppercase font-bold">Latest Automation Job</p>
                {latestJob ? (
                    <div className="bg-black p-3 rounded border border-slate-800 font-mono text-[11px] text-slate-400 flex items-center justify-between group hover:border-slate-600 transition-colors">
                        <div>
                            <span className="text-amber-500">[{latestJob.job_type.toUpperCase()}]</span>
                            <p className="text-[9px] text-slate-700 mt-1 uppercase">STATUS: {latestJob.status}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-800 group-hover:text-amber-500 transition-colors" />
                    </div>
                ) : (
                    <p className="text-[11px] text-slate-800 italic font-mono uppercase tracking-tighter">No jobs detected in queue.</p>
                )}
            </div>
         </div>
      </div>
    </div>
  );
};
