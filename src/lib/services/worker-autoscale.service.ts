import { PriorityQueueService } from "./priority-queue.service";

export class WorkerAutoscaleService {
  private static workerCount = 5;

  static async evalScale() {
    const depth = PriorityQueueService.getQueueDepth();
    if (depth > 20 && this.workerCount < 50) {
      this.workerCount += 5;
      console.log(`[Autoscale] Scaling UP to ${this.workerCount} workers.`);
    } else if (depth < 5 && this.workerCount > 5) {
      this.workerCount -= 1;
      console.log(`[Autoscale] Scaling DOWN to ${this.workerCount} workers.`);
    }
    return this.workerCount;
  }
}