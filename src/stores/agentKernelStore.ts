import { create } from 'zustand';
import type { TaskTemplate, DistrictType } from '../lib/world/types';
import { useWorldStore } from './worldStore';
import { usePenaltyStore } from './penaltyStore';
import { useReputationStore } from './reputationStore';
import { useForecastingStore } from './forecastingStore';
import { useSimulationStore } from './simulationStore';
import { usePolicyStore } from './policyStore';
import { useEnforcementStore } from './enforcementStore';
import { useEconomyStore } from './economyStore';
import { forecastAgentRisk } from '../lib/forecasting/forecastingEngine';
import { resolveLevelFromXp } from '../lib/progression/progressionEngine';
import { calculateConfidence, calculateReinforcementReward } from '../lib/intelligence/intelligenceEngine';
import { BehaviorProfiler } from '../lib/intelligence/behaviorProfiler';
import { PERSONALITY_TRAITS, AgentTrait } from '../lib/intelligence/personalityRegistry';
import { calculateDynamicReward } from '../lib/economy/marketPricing';
import { resolveBidding, Bid } from '../lib/economy/resourceArbitration';
import { verifyZeroTrust } from '../lib/security/accessControl';
import { calculateSwarmIntelligence } from '../lib/coordination/swarmEngine';
import { Fleet, formFleet } from '../lib/coordination/fleetManager';
import { GlobalMemory } from '../lib/memory/globalMemory';
import { shouldIsolateAgent } from '../lib/defense/intrusionResponse';
import { signTask } from '../lib/defense/integrityVerifier';
import { calculateDiplomaticPenalty } from '../lib/diplomacy/diplomaticCore';
import { mutateTrait } from '../lib/evolution/mutationEngine';
import { initializeSandbox, Sandbox } from '../lib/sandboxing/workspaceManager';
import { calculateShardIndex } from '../lib/clusters/clusterManager';
import { scoreMaliciousIntent } from '../lib/forensics/attackModeler';
import { calculateSynergy } from '../lib/progression/synergyModeler';
import { enforceConstitutionalGuard } from '../lib/alignment/constraintEngine';
import { calculateTargetTickRate } from '../lib/scalability/tickOptimizer';

export const TEMPLATES: TaskTemplate[] = [
  { id: 'tmpl-1', description: 'Stabilize coolant flow in Sector 7', requiredRole: 'HVAC', baseDuration: 6000, payoutAmount: 240 },
  { id: 'tmpl-2', description: 'Map unused territory along Vector 9', requiredRole: 'Mapper', baseDuration: 4000, payoutAmount: 180 },
  { id: 'tmpl-3', description: 'Provide crypto liquidity buffer', requiredRole: 'Crypto', baseDuration: 8000, payoutAmount: 800 },
  { id: 'tmpl-4', description: 'Audit random sector earnings', requiredRole: 'IRS', baseDuration: 5000, payoutAmount: 320 },
  { id: 'tmpl-5', description: 'Joint Inter-World Diplomatic Mission', requiredRole: 'ALL', baseDuration: 12000, payoutAmount: 2500 },
];

interface ActiveTask { id: string; description: string; agentId: string | null; fleetId?: string; requiredRole: string; payoutAmount: number; duration: number; progress: number; signature?: string; shardIndex?: number; chainedDistrict?: DistrictType }
interface AgentKernelStore { activeTasks: ActiveTask[]; fleets: Fleet[]; sandboxes: Sandbox[]; activeWorkspaceId: string; isRunning: boolean; tickInterval: number; generateTask: (district?: DistrictType) => void; generateTaskBatch: (count: number) => void; assembleFleet: (desc: string, dist: string, roles: string[]) => void; triggerTick: () => void; startSimulation: () => void; stopSimulation: () => void; assignTask: (tid: string, aid: string) => void; completeTask: (tid: string) => void }

export const useAgentKernelStore = create<AgentKernelStore>((set, get) => ({
  activeTasks: [],
  fleets: [],
  sandboxes: [],
  activeWorkspaceId: 'core-ws',
  isRunning: false,
  tickInterval: 1000,
  startSimulation: () => set({ isRunning: true }),
  stopSimulation: () => set({ isRunning: false }),
  generateTask: (district) => {
    const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
    const economy = useEconomyStore.getState();
    const dynamicPayout = calculateDynamicReward(template.id, template.payoutAmount, economy.marketVelocity);
    const taskId = "task-" + Date.now();
    set((state) => ({ activeTasks: [...state.activeTasks, { id: taskId, description: (district ? "[CHAINED] " : "") + template.description, agentId: null, requiredRole: template.requiredRole, payoutAmount: dynamicPayout, duration: template.baseDuration, progress: 0, signature: signTask(taskId), chainedDistrict: district }] }));
  },
  generateTaskBatch: (count) => {
    for (let i=0; i<count; i++) get().generateTask();
  },
  assembleFleet: (description, district, roles) => {
    const fleetId = "fleet-" + Date.now();
    set(state => ({ fleets: [...state.fleets, formFleet(fleetId, "pending", [], roles, district)], activeTasks: [...state.activeTasks, { id: "mtask-" + Date.now(), description: "[FLEET MISSION] " + description, agentId: null, fleetId, requiredRole: "FLEET", payoutAmount: 5000, duration: 30000, progress: 0 }] }));
  },
  triggerTick: () => {
    const { activeTasks, sandboxes, activeWorkspaceId, isRunning } = get();
    if (!isRunning) return;
    const world = useWorldStore.getState();
    const economy = useEconomyStore.getState();
    const nextTick = calculateTargetTickRate(activeTasks.length);
    set({ tickInterval: nextTick });

    useWorldStore.setState({ agents: world.agents.map(a => (shouldIsolateAgent(a.trustScore) && a.status !== 'jailed') ? { ...a, status: 'jailed' as any } : a) });
    economy.updateMarketVelocity(world.agents.filter(a => a.status === 'idle').length, {});
    
    if (world.globalDiplomaticStance === 'Ally' && Math.random() < 0.02) {
        get().generateTaskBatch(3);
    }

    const activeTasksUpdated = activeTasks.map((task) => {
      let nextProgress = task.progress;
      const virtualizationOverhead = world.realityDrift > 20 ? 0.8 : 1.0;
      const shardOverload = task.shardIndex !== undefined && activeTasks.filter(t => t.shardIndex === task.shardIndex).length > 2 ? 0.9 : 1.0;
      
      let resourceMod = 1.0;
      let specialistMod = 1.0;
      let geneticMod = 1.0; 
      let sovereignMod = world.sovereignName ? 2.0 : 1.0; // Phase 370

      if (task.agentId) {
          const agent = world.agents.find(a => a.id === task.agentId);
          const district = world.districts.find(d => d.id === agent?.district);
          if (district && (district.resources || 0) < 30) resourceMod = 0.8;
          if (agent && (agent.traits || []).includes('SPECIALIST')) specialistMod = 1.25;
          if (agent && (agent.traits || []).length >= 2) geneticMod = 1.2;
      }

      const coRoleCount = activeTasks.filter(t => t.requiredRole === task.requiredRole && t.agentId).length;
      const cohesionMod = coRoleCount > 2 ? 1.1 : 1.0;

      let synergyMod = 1.0;
      if (task.fleetId) {
          const fleetAgents = world.agents.filter(a => a.currentFleetId === task.fleetId);
          if (fleetAgents.length > 1) synergyMod = calculateSynergy(fleetAgents[0].traits as AgentTrait[], fleetAgents[1].traits as AgentTrait[]);
      }

      const delta = (1000 / task.duration) * 100 * virtualizationOverhead * shardOverload * resourceMod * cohesionMod * specialistMod * geneticMod * sovereignMod;

      if (task.fleetId) {
        const swarmMod = calculateSwarmIntelligence(world.agents.filter(a => a.currentFleetId === task.fleetId).map(a => a.confidence || 50)) / 100;
        nextProgress += delta * (1 + swarmMod) * synergyMod;
      } else if (task.agentId) nextProgress += delta;

      if (nextProgress >= 100) setTimeout(() => get().completeTask(task.id), 0);
      return { ...task, progress: Math.min(100, nextProgress) };
    });
    set({ activeTasks: activeTasksUpdated });
    
    world.agents.forEach(a => {
        const intentScore = scoreMaliciousIntent(GlobalMemory.getHistory().filter(h => h.id === a.id));
        if (intentScore > 50) useForecastingStore.getState().addPreReviewSignal({ taskId: 'FORENSICS', agentId: a.id, district: a.district, label: "HEURISTIC SUSPICION", severity: 'medium' });
    });

    activeTasksUpdated.forEach((task) => {
      if (!task.agentId && !task.fleetId) {
        const candidates = world.agents.filter(a => a.status === 'idle' && a.role === task.requiredRole);
        if (task.chainedDistrict) {
            const localWinner = candidates.find(a => a.district === task.chainedDistrict);
            if (localWinner) { get().assignTask(task.id, localWinner.id); return; }
        }
        const winnerId = resolveBidding(candidates.map(a => ({ agentId: a.id, amount: a.money, priority: a.level })));
        if (winnerId) get().assignTask(task.id, winnerId);
      }
    });

    useWorldStore.setState({ agents: world.agents.map(a => ({ ...a, confidence: calculateConfidence(a.level, (a.traits?.[0] as AgentTrait) || 'ADAPTIVE', world.stability * economy.marketVelocity.equilibriumFactor, a.xp) })) });
    
    // Post-Ascension Maintenance
    useWorldStore.getState().triggerQuantumTick();
    useWorldStore.getState().triggerAscensionTick();
    useWorldStore.getState().triggerSovereignTick();

    useWorldStore.getState().refreshGlobalMemory();
    useWorldStore.getState().triggerInfrastructureTick();
    useWorldStore.getState().triggerDiplomacyTick();
    useWorldStore.getState().triggerEvolutionTick();
    useWorldStore.getState().triggerVirtualizationTick();
    useWorldStore.getState().triggerClusterTick();
    useWorldStore.getState().triggerForensicsTick();
    useWorldStore.getState().triggerTenancyTick();
    useWorldStore.getState().triggerLifecycleTick();
    useWorldStore.getState().triggerPhysicsTick();
    useWorldStore.getState().triggerPinnacleTick();
  },
  assignTask: (taskId, agentId) => {
    const world = useWorldStore.getState();
    const { activeWorkspaceId } = get();
    const agent = world.agents.find((a) => a.id === agentId);
    if (!agent || agent.status === 'jailed' || agent.status === 'resting') return;
    const task = get().activeTasks.find(t => t.id === taskId);
    if (!task) return;
    if (!enforceConstitutionalGuard(task.description, world.stability)) return;
    if (!verifyZeroTrust(agent.trustScore, (task.payoutAmount / 100) + (100 - world.stability))) return; 
    const shard = calculateShardIndex(agentId, world.discoveredWorlds.length + 1);
    set((state) => ({ 
        activeTasks: state.activeTasks.map((t) => t.id === taskId ? { ...t, agentId, shardIndex: shard, duration: Math.max(1000, t.duration / (PERSONALITY_TRAITS[agent.traits?.[0] as AgentTrait]?.speed || 1)) } : t),
        sandboxes: [...state.sandboxes, initializeSandbox(agentId)]
    }));
    useWorldStore.setState({ agents: world.agents.map((a) => a.id === agentId ? { ...a, status: 'working' } : a) });
  },
  completeTask: (taskId) => {
    const task = get().activeTasks.find((t) => t.id === taskId);
    if (!task) return;
    set((state) => ({ activeTasks: state.activeTasks.filter((t) => t.id !== taskId) }));
    if (task.agentId) {
        const world = useWorldStore.getState();
        const agentId = task.agentId;
        const agent = world.agents.find(a => a.id === agentId);
        if (agent) {
             const diplomacyMod = calculateDiplomaticPenalty(world.globalDiplomaticStance);
             const energyMod = (world.districts.find(d => d.id === agent.district)?.energy || 100) / 100;
             let finalTraits = agent.traits || [];
             if (Math.random() < 0.05) finalTraits = mutateTrait(finalTraits as AgentTrait[]);
              if (agent.xp > 1000 && !finalTraits.includes('SPECIALIST')) finalTraits.push('SPECIALIST');
             
             // Phase 354: Recursive Simulation
             if (agent.level >= 15 && Math.random() < 0.1) {
                 setTimeout(() => get().generateTaskBatch(1), 200);
                 GlobalMemory.record(agent.id, "Recursive Simulation spawned: Sub-task initialized by high-tier consciousness", 100);
             }

             if (Math.random() < 0.15) setTimeout(() => get().generateTask(agent.district), 500);
             
             BehaviorProfiler.addLog(agent.id, (agent.traits?.[0] as AgentTrait) || 'ADAPTIVE', task.description, 'SUCCESS', agent.confidence || 50);
             const { releasedAmount } = useReputationStore.getState().getAgentPayoutPreview(task.agentId, task.payoutAmount);
             const finalPayout = releasedAmount * energyMod * diplomacyMod * (world.globalDiplomaticStance === 'Ally' ? 1.15 : 1.0);
             
             // Phase 357: Universal Knowledge
             const xpGain = Math.round(task.payoutAmount * 0.1);
             const nextXpPool = world.globalXpPool + Math.round(xpGain * 0.1);

             set((state) => ({ sandboxes: state.sandboxes.filter(s => s.agentId !== agentId) }));
             const nextAlignment = Math.min(100, (agent.alignmentScore || 80) + 1);
             
             const updatedAgents = world.agents.map((a) => a.id === agentId ? { ...a, status: 'idle', money: a.money + finalPayout, xp: a.xp + xpGain, level: resolveLevelFromXp(a.xp + xpGain), traits: finalTraits, alignmentScore: nextAlignment } : a);
             
             if ((agent.traits || []).includes('ENTANGLED')) {
                 const partner = updatedAgents.find(a => (a.traits || []).includes('ENTANGLED') && a.id !== agentId);
                 if (partner) { partner.xp += Math.round(xpGain * 0.5); partner.money += finalPayout * 0.2; }
             }

             useWorldStore.setState({ agents: updatedAgents, globalXpPool: nextXpPool, market: { ...world.market, totalValue: world.market.totalValue + finalPayout }, realityDrift: Math.max(0, world.realityDrift - 0.5) });
        }
    }
  },
}));
