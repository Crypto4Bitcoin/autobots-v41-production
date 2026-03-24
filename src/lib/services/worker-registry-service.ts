import { DBService } from "./supabase-service";

export class WorkerRegistryService {
  /**
   * Registers a new worker in the global registry.
   */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async registerWorker(worker: { id: string; type: string; hostname: string; metadata?: Record<string, any> }) {
    console.log(`[WorkerRegistry] Registering worker ${worker.id} (${worker.type}) at ${worker.hostname}`);
    
    // Rule 3: Dumb Workers (Validation)
    const allowedClasses = ["general", "browser", "media", "tool", "human_task", "projection_processor", "supervision"];
    if (!allowedClasses.includes(worker.type)) {
        throw new Error(`[Guardrail Violation] Worker type '${worker.type}' is not recognized as a valid execution workload class (Rule 3). Workers must stay dumb.`);
    }

    return DBService.upsertWorker({
      id: worker.id,
      worker_type: worker.type,
      status: "online",
      current_load: 0,
      metadata: worker.metadata || {},
      last_heartbeat: new Date().toISOString()
    });
  }

  /**
   * Updates worker heartbeat and current load.
   */
  async heartbeat(workerId: string, currentLoad: number) {
    return DBService.updateWorkerStatus(workerId, {
      last_heartbeat: new Date().toISOString(),
      current_load: currentLoad,
      status: "online"
    });
  }

  /**
   * Lists healthy workers for a specific workload class.
   */
  async getHealthyWorkers(workerType: string) {
    return DBService.listWorkers({
      worker_type: workerType,
      status: "online",
      heartbeat_after: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5m threshold
    });
  }
}
