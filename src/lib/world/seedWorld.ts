import type { WorldStateShape } from './types';

export const seedWorld: WorldStateShape = {
  worldName: 'Command Bridge',
  phaseLabel: 'SYS.STABLE',
  stability: 92,
  alertCount: 3,
  musicEnabled: true,
  selectedDistrict: 'territory',
  selectedAgentId: null,
  districts: [
    { id: 'industrial', label: 'Industrial', description: 'Production, fabrication, logistics.', health: 88, energy: 76, taxRate: 8, unlocked: true, restrictionLevel: 'open', trustScore: 86 },
    { id: 'territory', label: 'Territory', description: 'Spatial control, land growth.', health: 91, energy: 81, taxRate: 10, unlocked: true, restrictionLevel: 'open', trustScore: 89 },
    { id: 'economic', label: 'Economic', description: 'Task revenue, market liquidity.', health: 84, energy: 72, taxRate: 12, unlocked: true, restrictionLevel: 'open', trustScore: 82 },
    { id: 'institutional', label: 'Institutional', description: 'Governance, compliance.', health: 95, energy: 69, taxRate: 15, unlocked: true, restrictionLevel: 'open', trustScore: 93 },
    { id: 'defense', label: 'Network Defense', description: 'Cyber-security, threat detection.', health: 98, energy: 88, taxRate: 5, unlocked: true, restrictionLevel: 'open', trustScore: 97 },
  ],
  agents: [
    { id: 'agent-hvac-01', name: 'HVAC Prime', role: 'HVAC', district: 'industrial', level: 7, xp: 780, money: 4200, status: 'working', path: 'leveling', unlockedSkillIds: ['hvac-basics'], trustScore: 88, traits: ['ANALYTICAL'], confidence: 85, x: 22, y: 34 },
    { id: 'agent-build-01', name: 'Builder Forge', role: 'Construction', district: 'industrial', level: 5, xp: 460, money: 2900, status: 'idle', path: 'leveling', unlockedSkillIds: ['construction-basics'], trustScore: 83, traits: ['AGGRESSIVE'], confidence: 70, x: 30, y: 58 },
    { id: 'agent-tax-01', name: 'Revenue Sentinel', role: 'IRS', district: 'institutional', level: 9, xp: 1180, money: 6100, status: 'working', path: 'enterprise', unlockedSkillIds: ['irs-basics'], trustScore: 94, traits: ['CAUTIOUS'], confidence: 92, x: 70, y: 24 },
    { id: 'agent-eco-01', name: 'Market Runner', role: 'Crypto', district: 'economic', level: 6, xp: 620, money: 5100, status: 'paused', path: 'enterprise', unlockedSkillIds: ['crypto-basics'], trustScore: 79, traits: ['INNOVATIVE'], confidence: 65, x: 72, y: 62 },
    { id: 'agent-grid-01', name: 'Territory Scout', role: 'Mapper', district: 'territory', level: 4, xp: 300, money: 1800, status: 'working', path: 'leveling', unlockedSkillIds: ['mapper-basics'], trustScore: 85, traits: ['ADAPTIVE'], confidence: 75, x: 48, y: 18 },
  ],
  market: { totalValue: 2481200, activeAgents: 1420, growthRate: 12.4 },
};
