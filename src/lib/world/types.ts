export type DistrictType = 'industrial' | 'territory' | 'economic' | 'institutional' | 'defense';
export type AgentStatus = 'idle' | 'working' | 'paused' | 'alert' | 'jailed' | 'fleet_forming' | 'resting' | 'retired';
export type ProgressionPath = 'leveling' | 'enterprise';
export type DistrictRestrictionLevel = 'open' | 'restricted' | 'locked';

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  district: DistrictType;
  level: number;
  xp: number;
  money: number;
  status: AgentStatus;
  path: ProgressionPath;
  unlockedSkillIds: string[];
  trustScore: number;
  traits?: string[];
  confidence?: number;
  currentFleetId?: string;
  age: number;
  fatigue: number;
  alignmentScore: number; // Phase 302
  x: number;
  y: number;
}

export interface DistrictNode {
  id: DistrictType;
  label: string;
  description: string;
  health: number;
  energy: number;
  taxRate: number;
  unlocked: boolean;
  restrictionLevel: DistrictRestrictionLevel;
  trustScore: number;
  resources: number;
  degradation: number;
  monumentProgress: number;
  hasMonument: boolean;
}

export interface MarketStats {
  totalValue: number;
  activeAgents: number;
  growthRate: number;
}

export interface WorldStateShape {
  worldName: string;
  phaseLabel: string;
  stability: number;
  alertCount: number;
  musicEnabled: boolean;
  selectedDistrict: DistrictType | null;
  selectedAgentId: string | null;
  districts: DistrictNode[];
  agents: AgentNode[];
  market: MarketStats;
}

export const DistrictType = {} as any;
export const AgentStatus = {} as any;
const type_stub = (props: any) => null;
export default type_stub;
export const TaskTemplate = (props: any) => null;
export class TaskTemplateStub { static async execute() { return {}; } }
