'use client';

import React, { useState, useEffect } from 'react';

export default function IncidentCommandCenter() {
  const [incidents, setIncidents] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock load incidents
    setTimeout(() => {
      setIncidents([
        {
          incident_id: "INC-ag82k1",
          main_cause: "404 Route Mismatch",
          severity: "high",
          status: "repairing",
          alerts: 3,
          affected: "Gateway, Workforce",
          timestamp: new Date().toISOString()
        },
        {
          incident_id: "INC-zb91m2",
          main_cause: "Agent Crash (Sentinel)",
          severity: "critical",
          status: "new",
          alerts: 1,
          affected: "Maintenance Fabric",
          timestamp: new Date().toISOString()
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
              Incident Command Center
            </h1>
            <p className="text-white/50 mt-2">Real-time autonomous platform reliability governance</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
              <span className="text-red-400 text-sm font-bold uppercase tracking-wider">Active Outages: 2</span>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-lg">
              <span className="text-green-400 text-sm font-bold uppercase tracking-wider">System Health: 84%</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {incidents.map((inc) => (
              <div key={inc.incident_id} className="bg-[#0a0a0a] border border-white/10 p-6 rounded-2xl hover:border-red-500/50 transition-all group">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-mono text-white/40">{inc.incident_id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${inc.severity === 'critical' ? 'bg-red-500 text-black' : 'bg-orange-500/20 text-orange-400'}`}>
                        {inc.severity}
                      </span>
                      <span className="text-xs text-white/60">{new Date(inc.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h2 className="text-xl font-bold group-hover:text-red-400 transition-colors">{inc.main_cause}</h2>
                    <p className="text-white/40 mt-1">Affected: {inc.affected}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-white/60 text-sm mb-2 font-mono">Status: <span className="text-white font-bold uppercase">{inc.status}</span></div>
                    <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-neutral-200 transition-colors">
                      Approve Repair
                    </button>
                  </div>
                </div>
                <div className="mt-6 flex gap-8 border-t border-white/5 pt-6">
                  <div>
                    <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Alert Frequency</div>
                    <div className="text-2xl font-bold">{inc.alerts}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Confidence Score</div>
                    <div className="text-2xl font-bold text-green-400">92%</div>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Recommended Repair Plan</div>
                    <div className="text-sm text-white/70">Patching API Route Map &rarr; Re-mapping workforce target to absolute path.</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
