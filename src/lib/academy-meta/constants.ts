import { ConstitutionalRule } from './types';

export const META_CONSTITUTION: ConstitutionalRule[] = [
  {
    id: 'rule-truth',
    code: 'TRUTH_FIRST',
    name: 'Truth First',
    description: 'No product, post, or venture action may intentionally misrepresent facts.',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-safety',
    code: 'SAFE_GROWTH',
    name: 'Safe Growth',
    description: 'Growth strategies must reject unsafe, exploitative, or constitution-breaking tactics.',
    severity: 'critical',
    enabled: true,
  },
  {
    id: 'rule-memory',
    code: 'MEMORY_ACCOUNTABILITY',
    name: 'Memory Accountability',
    description: 'All venture memory must preserve provenance to teacher, student, or product origin.',
    severity: 'high',
    enabled: true,
  },
  {
    id: 'rule-compete',
    code: 'FAIR_COMPETITION',
    name: 'Fair Competition',
    description: 'Ventures may compete, but cannot sabotage other ventures or monopolize all assets.',
    severity: 'high',
    enabled: true,
  },
  {
    id: 'rule-reinvest',
    code: 'REINVEST_FOR_CONTINUITY',
    name: 'Reinvest For Continuity',
    description: 'Treasury systems should preserve reserves and reinvest to sustain the workforce.',
    severity: 'medium',
    enabled: true,
  },
];
