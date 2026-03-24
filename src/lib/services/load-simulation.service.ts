// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "./supabase-service";

export class LoadSimulationService {
  /**
   * Generates a massive burst of synthetic activity for a workspace.
   */
  async generateBurst(workspaceId: string, workflowCount: number, eventsPerWorkflow: number) {
    console.log(`[LoadSimulation] Starting burst for ${workspaceId}: ${workflowCount} workflows, ${eventsPerWorkflow} events each...`);

    const start = Date.now();
    let totalEvents = 0;

    for (let i = 0; i < workflowCount; i++) {
        const workflowRunId = `wf-load-${i}-${Math.random().toString(36).substring(7)}`;
        
        // Simulating rapid-fire events for the workflow
        for (let j = 0; j < eventsPerWorkflow; j++) {
            await DBService.logEvent({
                event_type: "load_sim_event",
                workflow_run_id: workflowRunId,
                payload: { iteration: j, burst_id: "B1" }
            });
            totalEvents++;
        }
    }

    const duration = (Date.now() - start) / 1000;
    console.log(`[LoadSimulation] Burst complete. ${totalEvents} events in ${duration}s (${Math.round(totalEvents / duration)} events/sec).`);
    
    return { totalEvents, duration, eps: totalEvents / duration };
  }
}
