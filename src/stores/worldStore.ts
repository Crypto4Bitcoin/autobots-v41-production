import { create } from 'zustand';
import { seedWorld } from '../lib/world/seedWorld';
import type { AgentNode, DistrictType, WorldStateShape } from '../lib/world/types';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { recognizeStabilityTrend } from '../lib/memory/patternRecognition';
import { calculateAutoRepair } from '../lib/infrastructure/healthManager';
import { optimizeEnergyDistribution } from '../lib/infrastructure/energyGrid';
import { useEconomyStore } from './economyStore';
import { ExternalWorld, DiplomaticStance } from '../lib/diplomacy/diplomaticCore';
import { discoverWorlds } from '../lib/diplomacy/discoveryEngine';
import { calculateFitness } from '../lib/evolution/fitnessMetrics';
import { synchronizeReality } from '../lib/virtualization/syncOrchestrator';
import { Cluster } from '../lib/clusters/clusterManager';
import { Snapshotter } from '../lib/forensics/snapshotter';
import { Workspace } from '../lib/tenancy/workspaceEngine';
import { PolicyVote } from '../lib/tenancy/governanceEngine';
import { applyFatigue, shouldRetire } from '../lib/progression/lifecycleManager';

interface WorldStore extends WorldStateShape {
  trend: 'STABLE' | 'DEGRADING' | 'IMPROVING';
  discoveredWorlds: (ExternalWorld & { health: number; load: number })[];
  globalDiplomaticStance: DiplomaticStance;
  evolutionFitness: number;
  realityDrift: number;
  lastSnapshotRPO: number;
  activeWorkspaces: Workspace[];
  policyVotes: PolicyVote[];
  globalXpPool: number;
  civilizationStatus: 'Active' | 'Ascended';
  sovereignName: string | null; // Phase 361
  setSelectedDistrict: (district: DistrictType) => void;
  setSelectedAgent: (agentId: string | null) => void;
  toggleMusic: () => void;
  refreshGlobalMemory: () => void;
  triggerInfrastructureTick: () => void;
  triggerDiplomacyTick: () => void;
  triggerEvolutionTick: () => void;
  triggerVirtualizationTick: () => void;
  triggerClusterTick: () => void;
  triggerForensicsTick: () => void;
  triggerTenancyTick: () => void;
  triggerLifecycleTick: () => void;
  triggerPhysicsTick: () => void;
  triggerPinnacleTick: () => void;
  triggerQuantumTick: () => void;
  triggerAscensionTick: () => void;
  triggerSovereignTick: () => void; // Phase 370
  triggerTacticalTick: () => void; // Phase 376
  triggerShardingTick: () => void; // Phase 378
  triggerUniversalTick: () => void; // Phase 380
}

let gen = -1;

export const useWorldStore = create<WorldStore>((set, get) => ({
  ...seedWorld,
  trend: 'STABLE',
  discoveredWorlds: [],
  globalDiplomaticStance: 'Neutral',
  evolutionFitness: 100,
  realityDrift: 0,
  lastSnapshotRPO: 0,
  activeWorkspaces: [{ id: 'core-ws', name: 'AutoBots Dev Core', quota: 5000, used: 1000 }],
  policyVotes: [],
  globalXpPool: 0,
  civilizationStatus: 'Active',
  sovereignName: null,

  setSelectedDistrict: (district) => set(() => ({ selectedDistrict: district, selectedAgentId: null, })),
  setSelectedAgent: (agentId) => set(() => ({ selectedAgentId: agentId })),
  toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

  refreshGlobalMemory: () => {
    const sentiment = GlobalMemory.getGlobalSentiment();
    set((state) => ({ stability: Math.min(100, Math.max(0, sentiment * 0.5 + state.stability * 0.5)), trend: recognizeStabilityTrend(GlobalMemory.getHistory()) }));
  },

  triggerInfrastructureTick: () => {
    const state = get();
    const economy = useEconomyStore.getState();
    let totalCost = 0;
    const repairedDistricts = state.districts.map(d => {
        const { repairedHealth, repairCost } = calculateAutoRepair(d.health, economy.treasuryBalance - totalCost);
        totalCost += repairCost;
        return { ...d, health: repairedHealth };
    });
    const finalDistricts = optimizeEnergyDistribution(repairedDistricts.map(d => ({ id: d.id, energy: d.energy }))).map((e, index) => ({ ...repairedDistricts[index], energy: e.energy }));
    if (totalCost > 0) useEconomyStore.setState({ treasuryBalance: economy.treasuryBalance - totalCost });
    set({ districts: finalDistricts });
  },

  triggerDiplomacyTick: () => {
    const { discoveredWorlds } = get();
    if (discoveredWorlds.length === 0 || Math.random() < 0.05) {
        set({ discoveredWorlds: discoverWorlds().map(w => ({ ...w, health: 100, load: 10 })) });
    } else {
        const avgHealth = discoveredWorlds.reduce((s, w) => s + w.health, 0) / discoveredWorlds.length;
        if (avgHealth > 90) set({ globalDiplomaticStance: 'Ally' });
    }
  },

  triggerEvolutionTick: () => {
    const { agents } = get();
    const fitness = calculateFitness(GlobalMemory.getHistory());
    const traitCounts = agents.reduce((acc, a) => {
        (a.traits || []).forEach(t => acc[t] = (acc[t] || 0) + 1);
        return acc;
    }, {} as Record<string, number>);
    const bottleneck = Object.values(traitCounts).some(v => v > agents.length * 0.7);
    const finalFitness = bottleneck ? fitness * 0.7 : fitness;
    set((state) => ({ evolutionFitness: finalFitness, market: { ...state.market, activeAgents: Math.floor(state.market.activeAgents * (1 + (finalFitness - 50) / 1000)) } }));
  },

  triggerVirtualizationTick: () => {
    const { stability, realityDrift, globalDiplomaticStance, districts, discoveredWorlds, evolutionFitness, civilizationStatus, sovereignName } = get();
    const anchorCount = districts.filter(d => d.hasMonument).length;
    const anchorStabilization = anchorCount * 0.5;

    if (sovereignName && civilizationStatus === 'Ascended') {
        set({ realityDrift: 0, stability: 100 });
        return;
    }

    if (realityDrift > 80 && civilizationStatus !== 'Ascended') {
        GlobalMemory.record("QUANTUM", "CRITICAL: Reality Collapse Event detected. Recalibrating timelines...", 100);
        set({ realityDrift: 0, stability: 10 });
        return;
    }

    if (realityDrift > 40 && globalDiplomaticStance === 'Ally' && Math.random() < 0.1) {
        const targetWorld = discoveredWorlds[0];
        if (targetWorld) {
            const syncedFitness = (evolutionFitness + targetWorld.health) / 2;
            set({ evolutionFitness: syncedFitness });
            GlobalMemory.record("QUANTUM", "Quantum Sharding: Timelines synced with Allied federation", 90);
        }
    }

    const alliedBoost = globalDiplomaticStance === 'Ally' ? 0.2 : 0;
    const ascensionBoost = civilizationStatus === 'Ascended' ? 2.0 : 0;
    const nextStability = synchronizeReality(realityDrift, stability);
    set({ stability: nextStability, realityDrift: Math.max(0, realityDrift + (Math.random() - 0.5) * 5 - alliedBoost - anchorStabilization - ascensionBoost) });
  },

  triggerClusterTick: () => {
    const { discoveredWorlds, market, districts, globalDiplomaticStance } = get();
    const economy = useEconomyStore.getState();
    const avgLoad = market.activeAgents / 10;
    const defenseHealth = districts.find(d => d.id === 'defense')?.health || 0;
    const defenseHeal = defenseHealth >= 100 ? 1 : 0;

    if (globalDiplomaticStance === 'Ally') {
        const tribute = 500;
        useEconomyStore.setState({ treasuryBalance: economy.treasuryBalance + tribute });
        if (Math.random() < 0.05) GlobalMemory.record("DIPLOMACY", "Galactic Tribute collected from Allied federation members", 100);
    }

    set({ 
        discoveredWorlds: discoveredWorlds.map(w => ({ ...w, load: Math.min(100, avgLoad + (Math.random() - 0.5) * 4), health: Math.min(100, w.health + defenseHeal - (w.load > 80 ? 1 : 0)) })) 
    });
  },

  triggerForensicsTick: () => {
    const state = get();
    if (Math.random() < 0.01) Snapshotter.takeSnapshot({ stability: state.stability, districts: state.districts, agents: state.agents });
    if (state.stability < 10) {
        const lastBackup = Snapshotter.getLatestSnapshot();
        if (lastBackup) set({ stability: lastBackup.stability, districts: lastBackup.districts, agents: lastBackup.agents });
    }
    set({ lastSnapshotRPO: Snapshotter.getRPO() });
  },

  triggerTenancyTick: () => {
    const { activeWorkspaces, policyVotes, market, stability } = get();
    const economy = useEconomyStore.getState();
    economy.triggerMarketTick(stability);
    set({ activeWorkspaces: activeWorkspaces.map(ws => ({ ...ws, used: Math.min(ws.quota, ws.used + Math.random() * 10) })), policyVotes: policyVotes.map(v => (Math.random() < 0.05) ? { ...v, votesFor: v.votesFor + 1 } : v), market: { ...market, growthRate: Math.max(0, market.growthRate + (0.05 - economy.interestRate) * 10) } });
  },

  triggerLifecycleTick: () => {
    const { agents, globalXpPool } = get();
    const nextAgents = agents.map(a => {
        const nextFatigue = applyFatigue(a.fatigue || 0, a.status === 'working');
        const nextAge = (a.age || 0) + 1;
        if (shouldRetire(nextAge, a.money || 0)) return { ...a, status: 'retired' as any };
        return { ...a, fatigue: nextFatigue, age: nextAge };
    });
    const activeAgents = nextAgents.filter(a => a.status !== 'retired');
    const retiredCount = agents.length - activeAgents.length;
    for (let i = 0; i < retiredCount; i++) {
        const district = ['industrial', 'territory', 'economic', 'institutional', 'defense'][Math.floor(Math.random() * 5)] as DistrictType;
        const topAgent = agents.filter(a => a.district === district).sort((a,b) => b.xp - a.xp)[0];
        const inheritedTraits = (topAgent && Math.random() < 0.25) ? [...(topAgent.traits || [])] : [];
        const startingXp = Math.floor(globalXpPool * 0.01);
        const newAgent: AgentNode = { id: gen--, name: "Agent", role: topAgent?.role || 'HVAC', district, level: 1, xp: startingXp, money: 100, status: 'idle', path: 'leveling', unlockedSkillIds: [], trustScore: 80, age: 0, fatigue: 0, alignmentScore: 80, traits: inheritedTraits, x: Math.random() * 100, y: Math.random() * 100 };
        activeAgents.push(newAgent);
    }
    set({ agents: activeAgents });
  },

  triggerPhysicsTick: () => {
    const { districts, agents, stability, civilizationStatus, sovereignName } = get();
    const updatedDistricts = districts.map(d => {
        const activeAgents = agents.filter(a => a.district === d.id && a.status === 'working');
        const activeLoad = activeAgents.length;
        const hvacCount = activeAgents.filter(a => a.role === 'HVAC').length;
        const hvacReduction = hvacCount * 0.05;
        const depleted = activeLoad > 0 ? 1 : 0;
        const degradationFactor = sovereignName ? 0 : 0.1;
        const nextDegradation = Math.min(100, (d.degradation || 0) + (activeLoad * degradationFactor) - (d.health / 100) - hvacReduction);
        let nextResources = Math.max(0, (d.resources || 100) - depleted);
        if (civilizationStatus === 'Ascended') nextResources = Math.max(50, nextResources);
        return { ...d, resources: nextResources, degradation: Math.max(0, nextDegradation) };
    });
    const sorted = [...updatedDistricts].sort((a,b) => (a.resources || 0) - (b.resources || 0));
    if (sorted[0] && sorted[sorted.length - 1] && (sorted[sorted.length-1].resources || 0) > 10) {
        sorted[0].resources = (sorted[0].resources || 0) + 1;
        sorted[sorted.length - 1].resources = (sorted[sorted.length-1].resources || 0) - 1;
    }
    const avgDegradation = updatedDistricts.reduce((sum, d) => sum + (d.degradation || 0), 0) / updatedDistricts.length;
    set({ districts: updatedDistricts, stability: Math.max(0, stability - (avgDegradation > 50 ? 0.5 : 0)) });
  },

  triggerPinnacleTick: () => {
    const { districts, agents, stability } = get();
    const updatedDistricts = districts.map(d => {
        let nextMonumentProgress = d.monumentProgress || 0;
        let isDone = d.hasMonument || false;
        if (d.health === 100 && !isDone) {
            nextMonumentProgress += 0.1;
            if (nextMonumentProgress >= 100) {
                isDone = true;
                GlobalMemory.record(d.id, "Grand Monument Completed", 100);
            }
        }
        const energyBoost = isDone ? 5 : 0;
        return { ...d, monumentProgress: nextMonumentProgress, hasMonument: isDone, energy: d.energy + energyBoost };
    });
    const specialistCount = agents.filter(a => (a.traits || []).includes('SPECIALIST')).length;
    let stabilityBonus = (specialistCount / (agents.length || 1) > 0.5) ? 1 : 0;
    set({ districts: updatedDistricts, stability: Math.min(100, stability + stabilityBonus) });
  },

  triggerQuantumTick: () => {
    const { agents } = get();
    const idleAgents = agents.filter(a => a.status === 'idle');
    if (idleAgents.length >= 2 && Math.random() < 0.05) {
        const a1 = idleAgents[Math.floor(Math.random() * idleAgents.length)];
        const a2 = idleAgents.find(a => a.id !== a1.id);
        if (a1 && a2) {
            set({ agents: agents.map(a => (a.id === a1.id || a.id === a2.id) ? { ...a, traits: [...(a.traits || []), 'ENTANGLED'] } : a) });
            GlobalMemory.record("QUANTUM", "Quantum Entanglement linked Agents together", 100);
        }
    }
  },

  triggerAscensionTick: () => {
    const { districts, evolutionFitness, civilizationStatus, stability } = get();
    const allBuilt = districts.every(d => d.hasMonument);
    if (allBuilt && evolutionFitness > 95 && civilizationStatus !== 'Ascended' && stability > 90) {
        set({ civilizationStatus: 'Ascended' });
        GlobalMemory.record("CIVILIZATION", "GRAND UNIFICATION COMPLETE: Timelines merged into Sovereign state (Phase 360)", 100);
    }
  },

  triggerSovereignTick: () => {
    const { civilizationStatus, sovereignName, stability } = get();
    if (civilizationStatus === 'Ascended' && !sovereignName && stability >= 100) {
        const newName = "SOVEREIGN-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        set({ sovereignName: newName });
        GlobalMemory.record("GALACTIC", "Sovereign Identity Manifested: Galactic Core online", 100);
    }
  },

  triggerTacticalTick: () => {
    // Phase 376: Automated Defensive Routing
    const { useCountermeasureStore } = require('./countermeasureStore');
    const { civilizationStatus } = get();
    if (civilizationStatus === 'Ascended' && Math.random() < 0.2) {
        useCountermeasureStore.getState().autoRouteBreaches();
    }
  },

  triggerShardingTick: () => {
    // Phase 378: Dimensional Sharding
    const { activeWorkspaces, market } = get();
    if (market.activeAgents > (activeWorkspaces.length * 50)) {
        const nextId = "shard-" + activeWorkspaces.length;
        set((state) => ({ 
            activeWorkspaces: [...state.activeWorkspaces, { id: nextId, name: `Shard ${nextId.toUpperCase()}`, quota: 5000, used: 0 }] 
        }));
        GlobalMemory.record("QUANTUM", `Dimensional Sharding: New workspace ${nextId} initialized to handle load`, 100);
    }
  },

  triggerUniversalTick: () => {
    // Phase 380: Ascended Mastery
    const { civilizationStatus, sovereignName, globalXpPool } = get();
    if (civilizationStatus === 'Ascended' && sovereignName) {
        set({ globalXpPool: globalXpPool + 10 });
        if (Math.random() < 0.02) GlobalMemory.record("GALACTIC", "Universal Orchestration: Perpetual knowledge expansion active", 100);
    }
  },
}));
