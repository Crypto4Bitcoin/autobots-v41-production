export interface MissionJob { id: string; priority: number; payload: unknown; }

export class PriorityQueueService {
  private static queue: MissionJob[] = [];

  static enqueue(job: MissionJob) {
    console.log(`[Queue] Enqueueing job ${job.id} with priority ${job.priority}`);
    this.queue.push(job);
    this.queue.sort((a, b) => b.priority - a.priority);
  }

  static getQueueDepth() { return this.queue.length; }
  static pop() { return this.queue.shift(); }
}