import { META_CONSTITUTION } from './constants';
import { ProductAsset, WorkerProfile } from './types';

export function assertConstitutionalProduct(product: ProductAsset): void {
  if (product.constitutinalScore < 70) {
    throw new Error(`Product ${product.id} failed constitutional threshold.`);
  }
}

export function assertConstitutinalWorker(worker: WorkerProfile): void {
  if (worker.constitutionalScore < 75) {
    throw new Error(`Worker ${worker.id} failed constitutional threshold.`);
  }
}

export function getEnabledRules() {
  return META_CONSTITUTION.filter((rule) => rule.enabled);
}
