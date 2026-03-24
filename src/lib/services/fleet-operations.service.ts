import { DBService } from "./supabase-service";

export class FleetOperationsService {
  /**
   * Cordons a worker, preventing new jobs from being scheduled to it.
   */
  async cordonWorker(workerId: string, reason: string) {
    console.log(`[FleetOps] Cordoning worker ${workerId}. Reason: ${reason}`);
    
    return DBService.updateWorkerStatus(workerId, { 
      status: "cordoned",
      metadata: { cordon_reason: reason, cordoned_at: new Date().toISOString() }
    });
  }

  /**
   * Uncordons a worker, returning it to the active pool.
   */
  async uncordonWorker(workerId: string) {
    console.log(`[FleetOps] Uncordoning worker ${workerId}`);
    
    return DBService.updateWorkerStatus(workerId, { 
      status: "online"
    });
  }

  /**
   * Puts a specific queue class into drain mode.
   */
  async drainQueue(queueType: string) {
    console.log(`[FleetOps] Entering DRAIN mode for queue: ${queueType}`);
    
    // In production, this updates 'queue_metadata' or notifies the router
    return DBService.logEvent({
        event_type: "queue_drain_initiated",
        payload: { queue_type: queueType }
    });
  }
}
