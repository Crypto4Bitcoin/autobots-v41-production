'use client';

import { useDefenseDistrictStore } from '../../stores/defenseDistrictStore';
import { useCountermeasureStore } from '../../stores/countermeasureStore';
import { worldTheme } from '../../lib/world/theme';

export default function ThreatFeed() {
  const memoryLog = useDefenseDistrictStore((s) => s.memoryLog);
  const routes = useCountermeasureStore((s) => s.routes);

  // Combine and sort events
  const tacticalEvents = [
    ...memoryLog.map(log => ({ type: 'log', message: log, timestamp: new Date() })), // Note: timestamp is a guess since not in log
    ...routes.slice(0, 10).map(route => ({ 
        type: 'route', 
        message: `COUNTERMEASURE: ${route.id} for ${route.cellId} (${route.status})`,
        status: route.status,
        timestamp: new Date(route.createdAt) 
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 50);

  return (
    <div className={`${worldTheme.panel} p-6 flex flex-col h-full border-indigo-500/20 shadow-2xl overflow-hidden bg-slate-900/40 backdrop-blur-md`}>
      <div className="flex items-center justify-between mb-6">
        <div className={worldTheme.sectionLabel + " text-indigo-400 flex items-center gap-2"}>
          <div className="h-1 w-4 bg-indigo-500 rounded-full" />
          TACTICAL EVENT LOG // MEMORY-P1
        </div>
        <div className="animate-pulse flex items-center gap-1.5 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <span className="text-[10px] uppercase tracking-widest text-red-400 font-bold">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {tacticalEvents.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-white/20 tracking-[0.3em] uppercase italic">
            Initial State - No Events
          </div>
        ) : (
          tacticalEvents.map((event, i) => (
            <div 
              key={i} 
              className={`p-4 rounded-2xl border transition-all hover:bg-white/5 group relative overflow-hidden ${
                event.type === 'route' ? 'border-indigo-500/30 bg-indigo-500/5' : 
                event.message.includes('THREAT') ? 'border-amber-500/30 bg-amber-500/5' : 
                'border-white/5 bg-white/5'
              }`}
            >
              {event.type === 'route' && (
                  <div className="absolute top-0 right-0 p-2">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                          event.status === 'resolved' ? 'bg-emerald-400' : 
                          event.status === 'failed' ? 'bg-red-400' : 'bg-indigo-400 animate-pulse'}`} />
                  </div>
              )}
              <div className="flex items-start gap-3">
                <span className="text-[10px] font-mono text-white/20 mt-0.5 group-hover:text-indigo-400 transition-colors">
                  [ {String(tacticalEvents.length - i).padStart(2, '0')} ]
                </span>
                <span className={`text-xs leading-relaxed tracking-wide ${
                  event.type === 'route' ? 'text-indigo-200' :
                  event.message.includes('THREAT') ? 'text-amber-200 font-medium' : 'text-white/60'
                }`}>
                  {event.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/20">
         <div className="flex gap-4">
            <span>Buffer: {tacticalEvents.length}/50</span>
            <span>Active Routes: {routes.filter(r => r.status === 'dispatched' || r.status === 'active').length}</span>
         </div>
         <span className="font-mono opacity-50">HASH: 0x8F2V...9K2</span>
      </div>
    </div>
  );
}
