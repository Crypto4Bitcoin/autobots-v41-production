type WorkerPath = 'matrix';

type MatrixWorker = {
  id: string;
  username: string;
  role: string;
  level: number;
  credits: number;
  completedTasks: number;
  createdAt: string;
  path: WorkerPath;
  assignedMachineId: string | null;
  status: 'active' | 'idle' | 'disabled' | 'jailed';
  taxDebt: number;
  trustScore: number;
  verifiedCount: number;
  failedCount: number;
  jailedCount: number;
};

type MatrixMachine = {
  id: string;
  hostName: string;
  machineType: 'builder-node' | 'pin-node' | 'verifier-node' | 'bridge-node' | 'archive-node';
  ipClass: 'private' | 'hybrid' | 'public-bridge';
  status: 'online' | 'offline' | 'maintenance';
  assignedWorkerId: string | null;
  lastWorkerId: string | null;
  createdAt: string;
};

type ComputerTask = {
  id: string;
  workerId: string;
  machineId: string | null;
  title: string;
  description: string;
  category: 'network' | 'storage' | 'security' | 'compute' | 'verification';
  status: 'assigned' | 'in_progress' | 'done' | 'failed' | 'held' | 'jailed';
  reward: number;
  xp: number;
  ipfsMode: 'private-cluster' | 'bridge-to-public-ipfs';
  createdAt: string;
  completedAt: string | null;
  irsStatus: 'not_started' | 'open' | 'verified' | 'failed' | 'held' | 'jailed' | 'released';
  irsCaseId: string | null;
};

type FileRecord = {
  id: string;
  workerId: string;
  taskId: string;
  machineId: string | null;
  cid: string;
  fileName: string;
  storageMode: 'private-ipfs' | 'public-ipfs';
  pinned: boolean;
  verified: boolean;
  createdAt: string;
};

type ActionLog = {
  id: string;
  actorType: 'worker' | 'machine' | 'system' | 'irs';
  actorId: string;
  action: string;
  targetType: 'task' | 'file' | 'machine' | 'worker' | 'system' | 'irs-case';
  targetId: string;
  details: Record<string, string | number | boolean | null>;
  createdAt: string;
};

type IRSStage =
  | 'intake'
  | 'health_check'
  | 'proof_check'
  | 'reward_tax'
  | 'store_record'
  | 'verify_pass'
  | 'verify_fail'
  | 'hold'
  | 'jail'
  | 'released';

type IRSCaseStatus =
  | 'open'
  | 'verified'
  | 'failed'
  | 'held'
  | 'jailed'
  | 'released';

type IRSCase = {
  id: string;
  workerId: string;
  taskId: string;
  fileId: string | null;
  status: IRSCaseStatus;
  currentStage: IRSStage;
  fraudScore: number;
  healthScore: number;
  proofScore: number;
  taxAmount: number;
  notes: string[];
  createdAt: string;
  updatedAt: string;
};

type IRSStageRecord = {
  id: string;
  caseId: string;
  stage: IRSStage;
  passed: boolean;
  details: Record<string, string | number | boolean | null>;
  createdAt: string;
};

type VerificationQueueItem = {
  id: string;
  taskId: string;
  workerId: string;
  irsCaseId: string;
  priority: 'low' | 'medium' | 'high';
  reason: string;
  status: 'pending' | 'reviewing' | 'resolved';
  createdAt: string;
};

const workers = new Map<string, MatrixWorker>();
const machines = new Map<string, MatrixMachine>();
const tasks = new Map<string, ComputerTask>();
const files = new Map<string, FileRecord>();
const logs = new Map<string, ActionLog>();
const irsCases = new Map<string, IRSCase>();
const irsStages = new Map<string, IRSStageRecord>();
const verificationQueue = new Map<string, VerificationQueueItem>();

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function now() {
  return new Date().toISOString();
}

function randomRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createLog(
  actorType: ActionLog['actorType'],
  actorId: string,
  action: string,
  targetType: ActionLog['targetType'],
  targetId: string,
  details: ActionLog['details'] = {}
) {
  const log: ActionLog = {
    id: makeId('LOG'),
    actorType,
    actorId,
    action,
    targetType,
    targetId,
    details,
    createdAt: now(),
  };

  logs.set(log.id, log);
  return log;
}

function createIRSStageRecord(
  caseId: string,
  stage: IRSStage,
  passed: boolean,
  details: IRSStageRecord['details'] = {}
) {
  const record: IRSStageRecord = {
    id: makeId('IRSSTG'),
    caseId,
    stage,
    passed,
    details,
    createdAt: now(),
  };

  irsStages.set(record.id, record);

  createLog('irs', 'IRS-CORE', `irs_stage_${stage}`, 'irs-case', caseId, {
    passed,
    ...details,
  });

  return record;
}

function ensureSeedMachines() {
  if (machines.size > 0) return;

  const seed: Omit<MatrixMachine, 'id' | 'createdAt'>[] = [
    {
      hostName: 'matrix-builder-01',
      machineType: 'builder-node',
      ipClass: 'private',
      status: 'online',
      assignedWorkerId: null,
      lastWorkerId: null,
    },
    {
      hostName: 'matrix-pin-01',
      machineType: 'pin-node',
      ipClass: 'private',
      status: 'online',
      assignedWorkerId: null,
      lastWorkerId: null,
    },
    {
      hostName: 'matrix-verify-01',
      machineType: 'verifier-node',
      ipClass: 'private',
      status: 'online',
      assignedWorkerId: null,
      lastWorkerId: null,
    },
    {
      hostName: 'matrix-bridge-01',
      machineType: 'bridge-node',
      ipClass: 'public-bridge',
      status: 'online',
      assignedWorkerId: null,
      lastWorkerId: null,
    },
    {
      hostName: 'matrix-archive-01',
      machineType: 'archive-node',
      ipClass: 'hybrid',
      status: 'online',
      assignedWorkerId: null,
      lastWorkerId: null,
    },
  ];

  for (const item of seed) {
    const machine: MatrixMachine = {
      id: makeId('MCH'),
      createdAt: now(),
      ...item,
    };
    machines.set(machine.id, machine);
  }
}

export function createMatrixWorker(username: string): MatrixWorker {
  ensureSeedMachines();

  const id = makeId('WRK');
  const machine = getAvailableMachine();

  const worker: MatrixWorker = {
    id,
    username,
    role: 'Computer Task Worker',
    level: 1,
    credits: 0,
    completedTasks: 0,
    createdAt: now(),
    path: 'matrix',
    assignedMachineId: machine?.id ?? null,
    status: 'active',
    taxDebt: 0,
    trustScore: 100,
    verifiedCount: 0,
    failedCount: 0,
    jailedCount: 0,
  };

  workers.set(id, worker);

  if (machine) {
    machine.assignedWorkerId = worker.id;
    machine.lastWorkerId = worker.id;
    machines.set(machine.id, machine);

    createLog('system', 'SYS-MATRIX', 'worker_assigned_machine', 'machine', machine.id, {
      workerId: worker.id,
      userName: username,
    });
  }

  createLog('system', 'SYS-MATRIX', 'worker_created', 'worker', worker.id, {
    username,
    assignedMachineId: worker.assignedMachineId,
  });

  return worker;
}

function getAvailableMachine(): MatrixMachine | null {
  ensureSeedMachines();

  for (const machine of machines.values()) {
    if (machine.status === 'online' && !machine.assignedWorkerId) {
      return machine;
    }
  }

  return Array.from(machines.values())[0] ?? null;
}

export function assignInitialComputerTask(workerId: string): ComputerTask | null {
  const worker = workers.get(workerId);
  if (!worker) return null;

  const starterTasks: Omit<ComputerTask, 'id' | 'workerId' | 'machineId' | 'createdAt' | 'completedAt' | 'irsStatus' | 'irsCaseId'>[] = [
    {
      title: 'Initialize Internal IPFS Node',
      description: 'Bring a local storage node online and register it to the private cluster.',
      category: 'storage',
      status: 'assigned',
      reward: 25,
      xp: 10,
      ipfsMode: 'private-cluster',
    },
    {
      title: 'Verify Secure Peer Connection',
      description: 'Check peer connections and confirm only approved nodes are reachable.',
      category: 'network',
      status: 'assigned',
      reward: 30,
      xp: 12,
      ipfsMode: 'private-cluster',
    },
    {
      title: 'Prepare Public Bridge Package',
      description: 'Package approved data for public IPFS bridge publication.',
      category: 'compute',
      status: 'assigned',
      reward: 40,
      xp: 15,
      ipfsMode: 'bridge-to-public-ipfs',
    },
    {
      title: 'Run CID Integrity Verification',
      description: 'Verify stored content hashes and compare expected file integrity.',
      category: 'verification',
      status: 'assigned',
      reward: 35,
      xp: 14,
      ipfsMode: 'private-cluster',
    },
  ];

  const selected = starterTasks[Math.floor(Math.random() * starterTasks.length)];

  const task: ComputerTask = {
    id: makeId('TSK'),
    workerId,
    machineId: worker.assignedMachineId,
    createdAt: now(),
    completedAt: null,
    irsStatus: 'not_started',
    irsCaseId: null,
    ...selected,
  };

  tasks.set(task.id, task);

  createLog('worker', workerId, 'task_assigned', 'task', task.id, {
    machineId: task.machineId,
    category: task.category,
    reward: task.reward,
  });

  return task;
}

export function getWorkerById(workerId: string) {
  return workers.get(workerId) || null;
}

export function getMachineById(machineId: string) {
  return machines.get(machineId) || null;
}

export function getTasksForWorker(workerId: string) {
  return Array.from(tasks.values()).filter((task) => task.workerId === workerId);
}

export function getFilesForWorker(workerId: string) {
  return Array.from(files.values()).filter((file) => file.workerId === workerId);
}

export function getLogsForWorker(workerId: string) {
  return Array.from(logs.values())
    .filter((log) => log.actorId === workerId || log.details.workerId === workerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getIRSCasesForWorker(workerId: string) {
  return Array.from(irsCases.values())
    .filter((item) => item.workerId === workerId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
}

export function getIRSStagesForCase(caseId: string) {
  return Array.from(irsStages.values())
    .filter((item) => item.caseId === caseId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getLatestIRSCaseForTask(taskId: string) {
  return Array.from(irsCases.values())
    .filter((item) => item.taskId === taskId)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0] || null;
}

export function getVerificationQueueForWorker(workerId: string) {
  return Array.from(verificationQueue.values())
    .filter((item) => item.workerId === workerId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function beginTask(taskId: string) {
  const task = tasks.get(taskId);
  if (!task) return null;

  task.status = 'in_progress';
  tasks.set(task.id, task);

  createLog('worker', task.workerId, 'task_started', 'task', task.id, {
    machineId: task.machineId,
  });

  return task;
}

export function completeTaskAndReward(params: {
  taskId: string;
  fileName: string;
  cid: string;
  storageMode: 'private-ipfs' | 'public-ipfs';
  pinned: boolean;
  verified?: boolean;
}) {
  const task = tasks.get(params.taskId);
  if (!task) return null;

  const worker = workers.get(task.workerId);
  if (!worker) return null;

  task.status = 'done';
  task.completedAt = now();
  tasks.set(task.id, task);

  worker.credits += task.reward;
  worker.completedTasks += 1;
  worker.level = calculateLevel(worker.completedTasks, worker.credits);
  workers.set(worker.id, worker);

  const file: FileRecord = {
    id: makeId('FIL'),
    workerId: worker.id,
    taskId: task.id,
    machineId: task.machineId,
    cid: params.cid,
    fileName: params.fileName,
    storageMode: params.storageMode,
    pinned: params.pinned,
    verified: params.verified ?? true,
    createdAt: now(),
  };

  files.set(file.id, file);

  createLog('worker', worker.id, 'task_completed', 'task', task.id, {
    reward: task.reward,
    newCredits: worker.credits,
    newLevel: worker.level,
    fileId: file.id,
  });

  createLog('machine', task.machineId ?? 'NO-MACHINE', 'file_stored', 'file', file.id, {
    cid: file.cid,
    storageMode: file.storageMode,
    pinned: file.pinned,
  });

  return {
    worker,
    task,
    file,
  };
}

export function freeMachineFromWorker(workerId: string) {
  const worker = workers.get(workerId);
  if (!worker) return null;

  if (!worker.assignedMachineId) {
    return { worker, machine: null };
  }

  const machine = machines.get(worker.assignedMachineId) || null;

  if (machine) {
    machine.lastWorkerId = worker.id;
    machine.assignedWorkerId = null;
    machines.set(machine.id, machine);

    createLog('system', 'SYS-MATRIX', 'machine_freed_from_worker', 'machine', machine.id, {
      workerId: worker.id,
    });
  }

  worker.assignedMachineId = null;
  workers.set(worker.id, worker);

  return { worker, machine };
}

export function assignMachineToWorker(workerId: string) {
  const worker = workers.get(workerId);
  if (!worker) return null;

  if (worker.status !== 'active') {
    return null;
  }

  if (worker.assignedMachineId) {
    const existing = machines.get(worker.assignedMachineId) || null;
    return { worker, machine: existing };
  }

  const machine = getAvailableMachine();
  if (!machine) return null;

  machine.assignedWorkerId = worker.id;
  machine.lastWorkerId = worker.id;
  machines.set(machine.id, machine);

  worker.assignedMachineId = machine.id;
  workers.set(worker.id, worker);

  createLog('system', 'SYS-MATRIX', 'worker_reassigned_machine', 'machine', machine.id, {
    workerId: worker.id,
  });

  return { worker, machine };
}

export function queueTaskForManualVerification(params: {
  taskId: string;
  workerId: string;
  irsCaseId: string;
  reason: string;
  priority?: 'low' | 'medium' | 'high';
}) {
  const item: VerificationQueueItem = {
    id: makeId('VRQ'),
    taskId: params.taskId,
    workerId: params.workerId,
    irsCaseId: params.irsCaseId,
    priority: params.priority ?? 'medium',
    reason: params.reason,
    status: 'pending',
    createdAt: now(),
  };

  verificationQueue.set(item.id, item);

  createLog('irs', 'IRS-CORE', 'task_sent_to_verification_queue', 'task', params.taskId, {
    workerId: params.workerId,
    irsCaseId: params.irsCaseId,
    queueId: item.id,
    priority: item.priority,
  });

  return item;
}

export function autoAssignNextTask(workerId: string) {
  const worker = workers.get(workerId);
  if (!worker) return null;
  if (worker.status !== 'active') return null;

  if (!worker.assignedMachineId) {
    assignMachineToWorker(workerId);
  }

  const activeOpenTask = Array.from(tasks.values()).find(
    (task) =>
      task.workerId === workerId &&
      (task.status === 'assigned' || task.status === 'in_progress' || task.status === 'held')
  );

  if (activeOpenTask) {
    return activeOpenTask;
  }

  const nextTask = assignInitialComputerTask(workerId);

  if (nextTask) {
    createLog('system', 'SYS-MATRIX', 'worker_auto_assigned_next_task', 'task', nextTask.id, {
      workerId,
    });
  }

  return nextTask;
}

export function runIRSVerification(taskId: string) {
  const task = tasks.get(taskId);
  if (!task) return null;

  const worker = workers.get(task.workerId);
  if (!worker) return null;

  const file = Array.from(files.values()).find((item) => item.taskId === task.id) || null;

  const taxAmount = Math.max(1, Math.floor(task.reward * 0.1));
  const healthScore = randomRange(60, 100);
  const proofScore = randomRange(55, 100);
  const fraudScore = 100 - Math.floor((healthScore + proofScore) / 2);

  const irsCase: IRSCase = {
    id: makeId('IRS'),
    workerId: worker.id,
    taskId: task.id,
    fileId: file?.id ?? null,
    status: 'open',
    currentStage: 'intake',
    fraudScore,
    healthScore,
    proofScore,
    taxAmount,
    notes: [],
    createdAt: now(),
    updatedAt: now(),
  };

  irsCases.set(irsCase.id, irsCase);

  task.irsStatus = 'open';
  task.irsCaseId = irsCase.id;
  tasks.set(task.id, task);

  createLog('irs', 'IRS-CORE', 'irs_case_opened', 'irs-case', irsCase.id, {
    workerId: worker.id,
    taskId: task.id,
    fileId: file?.id ?? null,
  });

  createIRSStageRecord(irsCase.id, 'intake', true, {
    workerId: worker.id,
    taskId: task.id,
  });

  irsCase.currentStage = 'health_check';
  irsCase.updatedAt = now();
  createIRSStageRecord(irsCase.id, 'health_check', healthScore >= 70, {
    healthScore,
  });

  irsCase.currentStage = 'proof_check';
  irsCase.updatedAt = now();
  createIRSStageRecord(irsCase.id, 'proof_check', proofScore >= 70, {
    proofScore,
    hasFile: Boolean(file),
    fileVerified: file?.verified ?? false,
    filePinned: file?.pinned ?? false,
  });

  const healthPass = healthScore >= 70;
  const proofPass = proofScore >= 70 && Boolean(file?.verified);

  if (healthPass && proofPass) {
    irsCase.currentStage = 'reward_tax';
    irsCase.updatedAt = now();

    worker.taxDebt += taxAmount;
    worker.credits = Math.max(0, worker.credits - taxAmount);
    worker.verifiedCount += 1;
    worker.trustScore = Math.min(100, worker.trustScore + 1);

    workers.set(worker.id, worker);

    createIRSStageRecord(irsCase.id, 'reward_tax', true, {
      taxAmount,
      creditsAfterTax: worker.credits,
    });

    irsCase.currentStage = 'store_record';
    irsCase.updatedAt = now();

    createIRSStageRecord(irsCase.id, 'store_record', true, {
      storedFileId: file?.id ?? null,
      storedCID: file?.cid ?? null,
    });

    irsCase.currentStage = 'verify_pass';
    irsCase.status = 'verified';
    irsCase.updatedAt = now();
    irsCase.notes.push('Task passed IRS verification.');

    task.irsStatus = 'verified';
    tasks.set(task.id, task);

    createIRSStageRecord(irsCase.id, 'verify_pass', true, {
      trustScore: worker.trustScore,
    });

    createLog('irs', 'IRS-CORE', 'irs_case_verified', 'irs-case', irsCase.id, {
      workerId: worker.id,
      taskId: task.id,
      taxAmount,
    });

    autoAssignNextTask(worker.id);
  } else {
    worker.failedCount += 1;
    worker.trustScore = Math.max(0, worker.trustScore - (proofPass ? 10 : 20));
    workers.set(worker.id, worker);

    if (fraudScore >= 35 || !proofPass) {
      irsCase.currentStage = 'jail';
      irsCase.status = 'jailed';
      irsCase.updatedAt = now();
      irsCase.notes.push('Task failed proof/fraud threshold and was jailed.');

      task.status = 'jailed';
      task.irsStatus = 'jailed';
      task.irsCaseId = irsCase.id;
      tasks.set(task.id, task);

      worker.status = 'jailed';
      worker.jailedCount += 1;
      workers.set(worker.id, worker);

      createIRSStageRecord(irsCase.id, 'verify_fail', false, {
        healthScore,
        proofScore,
        fraudScore,
      });

      createIRSStageRecord(irsCase.id, 'jail', false, {
        workerStatus: worker.status,
        trustScore: worker.trustScore,
      });

      createLog('irs', 'IRS-CORE', 'irs_case_jailed', 'irs-case', irsCase.id, {
        workerId: worker.id,
        taskId: task.id,
        fraudScore,
      });

      freeMachineFromWorker(worker.id);
    } else {
      irsCase.currentStage = 'hold';
      irsCase.status = 'held';
      irsCase.updatedAt = now();
      irsCase.notes.push('Task placed on hold for manual review.');

      task.status = 'held';
      task.irsStatus = 'held';
      task.irsCaseId = irsCase.id;
      tasks.set(task.id, task);

      createIRSStageRecord(irsCase.id, 'verify_fail', false, {
        healthScore,
        proofScore,
        fraudScore,
      });

      createIRSStageRecord(irsCase.id, 'hold', false, {
        trustScore: worker.trustScore,
      });

      createLog('irs', 'IRS-CORE', 'irs_case_held', 'irs-case', irsCase.id, {
        workerId: worker.id,
        taskId: task.id,
        fraudScore,
      });

      queueTaskForManualVerification({
        taskId: task.id,
        workerId: worker.id,
        irsCaseId: irsCase.id,
        reason: 'IRS hold triggered by proof/health review.',
        priority: fraudScore >= 25 ? 'high' : 'medium',
      });
    }
  }

  irsCases.set(irsCase.id, irsCase);

  return {
    case: irsCase,
    worker: workers.get(worker.id),
    task: tasks.get(task.id),
    file,
    stages: getIRSStagesForCase(irsCase.id),
  };
}

export function releaseWorkerFromJail(workerId: string) {
  const worker = workers.get(workerId);
  if (!worker) return null;

  worker.status = 'active';
  worker.trustScore = Math.min(100, worker.trustScore + 5);
  workers.set(worker.id, worker);

  const latestJailedCase = getIRSCasesForWorker(workerId).find((item) => item.status === 'jailed');
  if (latestJailedCase) {
    latestJailedCase.status = 'released';
    latestJailedCase.currentStage = 'released';
    latestJailedCase.updatedAt = now();
    latestJailedCase.notes.push('Worker released from jail.');
    irsCases.set(latestJailedCase.id, latestJailedCase);

    createIRSStageRecord(latestJailedCase.id, 'released', true, {
      workerStatus: worker.status,
      trustScore: worker.trustScore,
    });

    const relatedTask = tasks.get(latestJailedCase.taskId);
    if (relatedTask) {
      relatedTask.irsStatus = 'released';
      if (relatedTask.status === 'jailed') {
        relatedTask.status = 'done';
      }
      tasks.set(relatedTask.id, relatedTask);
    }
  }

  createLog('irs', 'IRS-CORE', 'worker_released_from_jail', 'worker', worker.id, {
    trustScore: worker.trustScore,
  });

  assignMachineToWorker(worker.id);
  autoAssignNextTask(worker.id);

  return worker;
}

function calculateLevel(completedTasks: number, credits: number) {
  if (completedTasks >= 20 || credits >= 750) return 5;
  if (completedTasks >= 12 || credits >= 400) return 4;
  if (completedTasks >= 7 || credits >= 200) return 3;
  if (completedTasks >= 3 || credits >= 80) return 2;
  return 1;
}

export function getWorldSnapshot(workerId: string) {
  const worker = getWorkerById(workerId);
  if (!worker) return null;

  const machine = worker.assignedMachineId ? getMachineById(worker.assignedMachineId) : null;
  const workerTasks = getTasksForWorker(workerId);
  const workerFiles = getFilesForWorker(workerId);
  const workerLogs = getLogsForWorker(workerId).slice(0, 25);
  const workerIRSCases = getIRSCasesForWorker(workerId);
  const workerQueue = getVerificationQueueForWorker(workerId);

  return {
    worker,
    machine,
    tasks: workerTasks,
    files: workerFiles,
    logs: workerLogs,
    irsCases: workerIRSCases,
    verificationQueue: workerQueue,
  };
}
