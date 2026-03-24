'use client';

import React, { useState, useEffect } from 'react';

export default function MemoryEcologyDashboard() {
  const [memoryStats, setMemoryStats] = useState({
    totalMemories: 0,
    coreMemories: 0,
    activeMemories: 0,
    archiveMemories: 0,
    garbageMemories: 0,
    mostReusedCluster: 'N/A',
    highestValueTrack: 'N/A',
    inheritanceCount: 0,
    memoryDecayWarnings: 0,
    marketplaceConversionRate: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMemoryStats({
        totalMemories: 1204,
        coreMemories: 88,
        activeMemories: 452,
        archiveMemories: 602,
        garbageMemories: 62,
        mostReusedCluster: 'HVAC Diagnostics',
        highestValueTrack: 'HVAC',
        inheritanceCount: 342,
        memoryDecayWarnings: 7,
        marketplaceConversionRate: 24.5,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 bg-[#0a0a0a] text-white font-mono rounded-lg border border-[#333]">
      <h2 className="text-xl font-bold mb-6 text-blue-500">MEMORY ECOLOGY :: INTELLIGENCE METRICS</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(memoryStats).map(([label, value]) => (
          <div key={label} className="p-4 bg-[#111] border border-[#222] rounded capitalize">
            <div className="text-xs text-gray-500">{label.replace(/([A-Z])/g, ' $1')}</div>
            <div className="text-lg font-bold">
              {typeof value === 'number' && label.toLowerCase().includes('rate') ? `${value}%` : value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
