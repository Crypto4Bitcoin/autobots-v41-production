'use client';
import ThreatFeed from "./ThreatFeed";
import { useEffect } from "react";
import { useDefenseDistrictStore } from "../../stores/defenseDistrictStore";
import { useCountermeasureStore } from "../../stores/countermeasureStore";
import DistrictIndustrial from './districts/DistrictIndustrial';
import DistrictTerritory from './districts/DistrictTerritory';
import DistrictEconomic from './districts/DistrictEconomic';
import DistrictInstitutional from './districts/DistrictInstitutional';
import DistrictDefense from './districts/DistrictDefense';
import AgentLayer from './AgentLayer';

// Standard UI
import GovernancePanel from './GovernancePanel';
import TreasuryPanel from './TreasuryPanel';
import NetworkDefensePanel from './NetworkDefensePanel';

// Phase 19-21 Check/Enforcement/Memory/Penalties
import EnforcementPanel from './EnforcementPanel';
import AuditPanel from './AuditPanel';
import RecoveryPanel from './RecoveryPanel';
import PenaltyPanel from './PenaltyPanel';
import ReputationPanel from './ReputationPanel';
import TreasuryHoldPanel from './TreasuryHoldPanel';

// Phase 22-25 Forecast/Simulation/Policy
import ForecastPanel from './ForecastPanel';
import RiskRadarPanel from './RiskRadarPanel';
import SimulationPanel from './SimulationPanel';
import RoutingPanel from './RoutingPanel';
import PolicyPanel from './PolicyPanel';
import DoctrinePanel from './DoctrinePanel';
import { InternetResearchAgentTeamPanel } from './districts/InternetResearchAgentTeamPanel';

import { worldTheme } from '../../lib/world/theme';

const STARS = Array.from({ length: 45 }).map((_, i) => ({
    id: `star-${i}`,
    left: `${(i * 13) % 100}%`,
    top: `${(i * 17) % 100}%`,
    size: `${2 + (i % 4)}px`,
    opacity: 0.2 + (i % 7) * 0.1,
}));

export default function WorldCanvas() {
    const generateThreats = useDefenseDistrictStore((s) => s.generateThreats);
  const tick = useDefenseDistrictStore((s) => s.tick);
  const autoRouteBreaches = useCountermeasureStore((s) => s.autoRouteBreaches);

  useEffect(() => {
    const interval = setInterval(() => {
      // 15% chance to generate a threat every 10 seconds
      tick();
      autoRouteBreaches();
      if (Math.random() < 0.15) {
        generateThreats();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [generateThreats, tick, autoRouteBreaches]);

  return (
    <div className={`relative h-[900px] w-full overflow-hidden rounded-[32px] border border-white/5 bg-[#030509] shadow-2xl`}>
      <div className="pointer-events-none absolute inset-0 z-0 opacity-40 mix-blend-screen">
        {STARS.map((star) => (
          <span
            key={star.id}
            className="absolute rounded-full bg-blue-300 shadow-[0_0_8px_rgba(147,197,253,0.8)]"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-0 bg-[url('/grid.svg')] opacity-10" />

      {/* Primary Intelligence Panels */}
      <GovernancePanel />
      <TreasuryPanel />
      <NetworkDefensePanel />
      <div className="absolute left-[24px] bottom-[110px] z-30 w-[300px] h-[340px]">
        <ThreatFeed />
      </div>
      
      {/* Enforcement & Audit Stack */}
      <EnforcementPanel />
      <AuditPanel />
      <RecoveryPanel />
      <PenaltyPanel />
      <ReputationPanel />
      <TreasuryHoldPanel />
      
      {/* Strategic Layer */}
      <ForecastPanel />
      <RiskRadarPanel />
      <SimulationPanel />
      <RoutingPanel />
      <PolicyPanel />
      <DoctrinePanel />
      <InternetResearchAgentTeamPanel />

      <div className={`absolute inset-4 z-10 grid grid-cols-2 grid-rows-3 ${worldTheme.spacing.panelGap}`}>
        <div className={`relative overflow-hidden ${worldTheme.panel} bg-slate-900/40`}>
          <DistrictIndustrial />
        </div>

        <div className={`relative overflow-hidden ${worldTheme.panel} bg-emerald-900/40`}>
          <DistrictTerritory />
        </div>

        <div className={`relative overflow-hidden ${worldTheme.panel} bg-amber-900/40`}>
          <DistrictEconomic />
        </div>

        <div className={`relative overflow-hidden ${worldTheme.panel} bg-rose-900/40`}>
          <DistrictInstitutional />
        </div>

        <div className={`relative overflow-hidden ${worldTheme.panel} bg-indigo-900/40`}>
          <DistrictDefense />
        </div>

        <div className={`relative overflow-hidden ${worldTheme.panel} bg-blue-900/20 opacity-30 flex items-center justify-center`}>
           <div className={worldTheme.sectionLabel}>Reserved // Deep Space</div>
        </div>
      </div>

      <AgentLayer />
    </div>
  );
}
