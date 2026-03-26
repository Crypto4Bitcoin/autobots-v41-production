export type ScoreInput = {
  signalVolume: number;
  verifiedSourceRatio: number;
  eventSeverity: number;
  volatility: number;
  freshness?: number;
  relayStrength?: number;
  lineageDepth?: number;
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

export function computeInfluenceScore(input: ScoreInput) {
  return clamp(
    input.signalVolume * 0.35 +
    input.verifiedSourceRatio * 30 +
    input.eventSeverity * 18 -
    input.volatility * 0.12 +
    (input.relayStrength ?? 0) * 0.15
  );
}

export function computeStabilityScore(input: ScoreInput) {
  return clamp(
    100 -
      (input.volatility * 0.4 + input.eventSeverity * 9) +
      input.verifiedSourceRatio * 20 +
      (input.relayStrength ?? 0) * 0.1 +
      (input.freshness ?? 0) * 0.08
  );
}

export function computeRiskRate(input: ScoreInput) {
  return clamp(
    input.volatility * 0.45 +
      input.eventSeverity * 10 +
      (1 - input.verifiedSourceRatio) * 15 +
      (100 - (input.freshness ?? 100)) * 0.1
  );
}

export function computeIntegrityScore(input: ScoreInput) {
  return clamp(
    input.verifiedSourceRatio * 35 +
      (input.freshness ?? 100) * 0.25 +
      (input.relayStrength ?? 0) * 0.25 -
      input.volatility * 0.2 -
      input.eventSeverity * 5
  );
}

export function computeSourceConfidence(sourceCount: number, staleHours: number, contradictionCount: number) {
  return clamp(sourceCount * 14 - staleHours * 0.35 - contradictionCount * 8);
}

export function buildGridCellCount(levels = [9, 9, 9]) {
  return levels.reduce((total, value) => total * value, 1);
}
