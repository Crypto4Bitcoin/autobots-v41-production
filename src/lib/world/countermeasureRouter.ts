import type { DefenseAgentClass } from '@/types/world';
import type { ThreatLevel, ThreatType, CountermeasureRoute } from '@/types/countermeasures';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function buildThreatLevel(breachCount: number): ThreatLevel {
  if (breachCount >= 6) return 'critical';
  if (breachCount >= 3) return 'high';
  if (breachCount >= 1) return 'medium';
  return 'low';
}

function routeClasses(
  threatType: ThreatType,
  threatLevel: ThreatLevel
): {
  primaryClass: DefenseAgentClass;
  supportClasses: DefenseAgentClass[];
  assignedAgents: number;
  notes: string[];
} {
  switch (threatType) {
    case 'breach':
      return {
        primaryClass: 'lock',
        supportClasses:
          threatLevel === 'critical'
            ? ['gate', 'proof', 'repair', 'shadow']
            : ['gate', 'proof', 'repair'],
        assignedAgents: threatLevel === 'critical' ? 12 : threatLevel === 'high' ? 8 : 4,
        notes: ['Breach routing activated. Lock and containment prioritized.'],
      };

    case 'intrusion':
      return {
        primaryClass: 'gate',
        supportClasses: ['watch', 'proof', 'shadow'],
        assignedAgents: threatLevel === 'critical' ? 10 : 5,
        notes: ['Intrusion path sealed and monitored.'],
      };

    case 'fraud':
      return {
        primaryClass: 'irs',
        supportClasses: ['proof', 'shadow', 'lock'],
        assignedAgents: threatLevel === 'critical' ? 9 : 4,
        notes: ['Fraud detection pipeline engaged.'],
      };

    case 'signal-loss':
      return {
        primaryClass: 'repair',
        supportClasses: ['watch', 'gate'],
        assignedAgents: threatLevel === 'critical' ? 6 : 3,
        notes: ['Signal continuity repair initiated.'],
      };

    case 'policy-violation':
      return {
        primaryClass: 'sos',
        supportClasses: ['gate', 'proof', 'irs'],
        assignedAgents: threatLevel === 'critical' ? 8 : 4,
        notes: ['Policy enforcement agents dispatched.'],
      };

    case 'market-corruption':
      return {
        primaryClass: 'market',
        supportClasses: ['proof', 'irs', 'shadow', 'lock'],
        assignedAgents: threatLevel === 'critical' ? 10 : 5,
        notes: ['Market integrity protection triggered.'],
      };

    default:
      return {
        primaryClass: 'watch',
        supportClasses: ['proof'],
        assignedAgents: 2,
        notes: ['Fallback routing engaged.'],
      };
  }
}

export function classifyThreat(params: {
  breachCount: number;
  alerts: number;
}): {
  threatType: ThreatType;
  threatLevel: ThreatLevel;
} {
  const threatLevel = buildThreatLevel(params.breachCount);

  if (params.breachCount > 0) {
    return { threatType: 'breach', threatLevel };
  }

  if (params.alerts >= 4) {
    return { threatType: 'policy-violation', threatLevel: 'high' };
  }

  return { threatType: 'signal-loss', threatLevel: 'low' };
}

export function createCountermeasureRoute(params: {
  cellId: string;
  threatType: ThreatType;
  threatLevel: ThreatLevel;
}): CountermeasureRoute {
  const routing = routeClasses(params.threatType, params.threatLevel);

  return {
    id: makeId('CMR'),
    createdAt: now(),
    cellId: params.cellId,
    threatType: params.threatType,
    threatLevel: params.threatLevel,
    status: 'queued',
    primaryClass: routing.primaryClass,
    supportClasses: routing.supportClasses,
    assignedAgents: routing.assignedAgents,
    notes: routing.notes,
  };
}