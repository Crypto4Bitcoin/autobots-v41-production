export class MetricAggregationService {
  /**
   * Aggregates raw platform events into high-level health summaries.
   * Prevents observability overload by filtering noise and showing trends.
   */
  async aggregateHealth(events: unknown[]) {
    console.log(`[MetricAggregation] Summarizing health trends from ${events.length} raw events...`);
    
    const workspaceHealth: Record<string, { success: number; failure: number; total: number }> = {};

    events.forEach(e => {
        const wsId = e.workspace_id || "global";
        if (!workspaceHealth[wsId]) {
            workspaceHealth[wsId] = { success: 0, failure: 0, total: 0 };
        }

        workspaceHealth[wsId].total++;
        if (e.event_type === "node_completed") workspaceHealth[wsId].success++;
        if (e.event_type === "node_failed") workspaceHealth[wsId].failure++;
    });

    // Calculate health scores (0-100)
    const summaries = Object.keys(workspaceHealth).map(wsId => {
        const stats = workspaceHealth[wsId];
        const score = stats.total > 0 ? (stats.success / stats.total) * 100 : 100;
        return {
            workspace_id: wsId,
            health_score: score.toFixed(2),
            status: score > 90 ? "healthy" : score > 70 ? "warning" : "critical"
        };
    });

    return summaries;
  }
}
