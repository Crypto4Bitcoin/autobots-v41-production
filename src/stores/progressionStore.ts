import { create } from 'zustand';
import type { ProgressionState } from '../lib/progression/types';
import { useWorldStore } from './worldStore';
import { usePenaltyStore } from './penaltyStore';
import { resolveLevelFromXp } from '../lib/progression/progressionEngine';

interface ProgressionStore extends ProgressionState {
  addEnterpriseXp: (agentId: string, amount: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useProgressionStore = create<ProgressionStore>((set) => ({
  mode: 'milestone',
  globalSkillUnlocked: false,

  addEnterpriseXp: (agentId, amount) => {
    const world = useWorldStore.getState();
    const agent = world.agents.find((a) => a.id === agentId);
    if (!agent) return;

    const penalties = usePenaltyStore.getState().penalties;
    const isSuspended = penalties.some(
      (p) => p.active && p.agentId === agent.id && p.type === 'enterprise_suspension'
    );
    if (isSuspended) return;

    useWorldStore.setState({
      agents: world.agents.map((a) => {
        if (a.id !== agent.id) return a;
        const newXp = a.xp + amount;
        return {
          ...a,
          xp: newXp,
          level: resolveLevelFromXp(newXp)
        };
      })
    });
  }
}));
