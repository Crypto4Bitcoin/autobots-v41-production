import { describe, expect, it } from 'vitest';
import { calculateVerifierConfidence, detectContradictions, staleDataHours } from '../lib/verifier/checks';

describe('verifier checks', () => {
  it('counts contradictions', () => {
    expect(detectContradictions(['a', 'a', 'b'])).toBe(1);
  });

  it('marks missing verification time as stale', () => {
    expect(staleDataHours()).toBeGreaterThan(48);
  });

  it('builds a confidence score', () => {
    expect(calculateVerifierConfidence(4, new Date().toISOString(), 0)).toBeGreaterThan(40);
  });
});
