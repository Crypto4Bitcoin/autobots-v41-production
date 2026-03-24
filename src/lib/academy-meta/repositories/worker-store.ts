import { WorkerProfile } from '../types';

export class WorkerStore {
  private workers: WorkerProfile[] = [];

  async create(worker: WorkerProfile) {
    this.workers.push(worker);
    return worker;
  }

  async list() {
    return this.workers;
  }

  async listGraduatesAvailable() {
    return this.workers.filter((w) => !w.nentureId && w.active);
  }

 async update(id: string, patch: Partial<WorkerProfile>) {
    const worker = this.workers.find((w) => w.id === id);
    if (!worker) return null;
    Object.assign(worker, patch);
    return worker;
  }
}

export const workerStore = new WorkerStore();
