import { computeSourceConfidence } from '@/lib/scoring';

export function staleDataHours(verifiedAt?: string | null) {
  if (!verifiedAt) return 999;
  const diffMs = Date.now() - new Date(verifiedAt).getTime();
  return Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
}

export function detectContradictions(values: Array<string | number | null | undefined>) {
  const normalized = values.filter((value) => value !== null && value !== undefined).map((value) => String(value));
  return Math.max(0, new Set(normalized).size - 1);
}

export function calculateVerifierConfidence(sourceCount: number, verifiedAt?: string | null, contradictions = 0) {
  return computeSourceConfidence(sourceCount, staleDataHours(verifiedAt), contradictions);
}

export function shouldRaiseIssue(confidence: number, staleHours: number, contradictions: number) {
  return confidence < 55 || staleHours > 48 || contradictions > 0;
}
