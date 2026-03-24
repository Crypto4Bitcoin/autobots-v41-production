'use client';

import React, { useState, useEffect } from 'react';

export default function CircleOfLIFEControl() {
  const [stats, setStats] = useState({
    totalAgents: 0,
    verifiedStudents: 0,
    marketplaceSales: 0,
    irsCapturedValue: 0,
    averageLevel: 0,
    quarantinedAgents: 0,
    threatsBlocked: 0,
    contentBoxesCreated: 0,
    systemSecurityPercent: 100,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalAgents: 142,
        verifiedStudents: 28,
        marketplaceSales: 19,
        irsCapturedValue: 58240,
        averageLevel: 4.2,
        quarantinedAgents: 3,
        threatsBlocked: 81,
        contentBoxesCreated: 440,
        systemSecurityPercent: 99.9,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 bg-[#0a0a0a] text-white font-mono rounded-lg border border-[#333]">
      <h2 className="text-xl font-bold mb-6 text-green-500">CIRCLE OF LIFE :: SYSTEM AUDIT</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([label, value]) => (
          <div key={label} className="p-4 bg-[#111] border border-[#222] rounded capitalize">
            <div className="text-xs text-gray-500">{label.replace(/([A-Z])/g, ' $1')}</div>
            <div className="text-lg font-bold">
              {typeof value === 'number' && label.toLowerCase().includes('value') ? `$${value.toLocaleString()}` : value}
              {label === 'systemSecurityPercent' ? '%' : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
