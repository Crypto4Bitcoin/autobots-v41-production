export function beginTask(_payload: unknown) { (void _payload); return { status: 'started' }; }
export function completeTaskAndReward(_payload: unknown) { (void _payload); return { ok: true, reward: 100 }; }
export function runIRSVerification(_payload: unknown) { (void _payload); return { verified: true }; }
export function releaseWorkerFromJail(_payload: unknown) { (void _payload); return { released: true }; }
export function getWorldSnapshot(workerId: string) {
  return { 
    worker: { id: workerId, role: 'mock', level: 1, credits: 0, completedTasks: 0, status: 'idle', trustScore: 100, taxDebt: 0, verifiedCount: 0, failedCount: 0, jailedCount: 0 },
    machine: null,
    tasks: [],
    files: [],
    logs: [],
    irsCases: [],
    verificationQueue: []
  };
}
