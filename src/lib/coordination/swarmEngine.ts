export function calculateSwarmIntelligence(confidenceLevels: number[]): number {
    if (confidenceLevels.length === 0) return 0;
    const avg = confidenceLevels.reduce((a, b) => a + b, 0) / confidenceLevels.length;
    const variance = confidenceLevels.reduce((acc, c) => acc + Math.pow(c - avg, 2), 0) / confidenceLevels.length;
    return Math.min(100, avg * (1 / (1 + Math.sqrt(variance))));
}
export function syncParallelProgress(memberProgress: number[]): number {
    // Phase 134: Parallel task synchronization
    if (memberProgress.length === 0) return 0;
    return memberProgress.reduce((a, b) => a + b, 0) / memberProgress.length;
}
