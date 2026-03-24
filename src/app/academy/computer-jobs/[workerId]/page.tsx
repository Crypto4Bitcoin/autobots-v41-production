import { getWorldSnapshot } from '@/lib/matrix-world';

type PageProps = {
  params: Promise<{ workerId: string }>;
};

export default async function ComputerJobsPage({ params }: PageProps) {
  const { workerId } = await params;
  const snapshot = getWorldSnapshot(workerId);

  if (!snapshot) {
    return (
      <main className="min-h-screen bg-black text-white p-8">
        <h1 className="text-2xl font-bold">Worker not found</h1>
      </main>
    );
  }

  const { worker, machine, tasks, files, logs, irsCases, verificationQueue } = snapshot;

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">Matrix Computer Jobs</h1>
          <p className="text-zinc-400">
            Stay in the Matrix and get assigned directly into computer-task labor cycles.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card title="Worker ID" value={worker.id} />
          <Card title="Role" value={worker.role} />
          <Card title="Level" value={String(worker.level)} />
          <Card title="Credits" value={String(worker.credits)} />
          <Card title="Completed" value={String(worker.completedTasks)} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card title="Status" value={worker.status} />
          <Card title="Trust Score" value={String(worker.trustScore)} />
          <Card title="Tax Debt" value={String(worker.taxDebt)} />
          <Card title="Verified" value={String(worker.verifiedCount)} />
          <Card title="Failed / Jailed" value={`${worker.failedCount} / ${worker.jailedCount}`} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold mb-4">Assigned Machine</h2>
            {machine ? (
              <div className="space-y-3 text-sm">
                <Row label="Machine ID" value={machine.id} />
                <Row label="Host Name" value={machine.hostName} />
                <Row label="Type" value={machine.machineType} />
                <Row label="IP Class" value={machine.ipClass} />
                <Row label="Status" value={machine.status} />
              </div>
            ) : (
              <p className="text-zinc-400">No machine assigned.</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold mb-4">Latest Files</h2>
            <div className="space-y-3">
              {files.length === 0 ? (
                <p className="text-zinc-400">No file outputs yet.</p>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="rounded-xl bg-zinc-950 border border-zinc-800 p-4">
                    <p className="font-medium">{file.fileName}</p>
                    <p className="text-xs text-zinc-400 break-all">{file.cid}</p>
                    <p className="text-sm text-zinc-300 mt-2">
                      {file.storageMode} • pinned: {String(file.pinned)} • verified: {String(file.verified)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <p className="text-zinc-400">{task.description}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-sm w-fit">
                    {task.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 mt-4 text-sm">
                  <Mini label="Task ID" value={task.id} />
                  <Mini label="Category" value={task.category} />
                  <Mini label="Reward" value={`${task.reward} credits`} />
                  <Mini label="XP" value={`${task.xp}`} />
                  <Mini label="Mode" value={task.ipfsMode} />
                  <Mini label="IRS" value={task.irsStatus} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">IRS Cases</h2>
          <div className="space-y-4">
            {irsCases.length === 0 ? (
              <p className="text-zinc-400">No IRS verification cases yet.</p>
            ) : (
              irsCases.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.id}</h3>
                      <p className="text-zinc-400">Task: {item.taskId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-sm w-fit">
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 text-sm">
                    <Mini label="Stage" value={item.currentStage} />
                    <Mini label="Fraud Score" value={String(item.fraudScore)} />
                    <Mini label="Health Score" value={String(item.healthScore)} />
                    <Mini label="Proof Score" value={String(item.proofScore)} />
                    <Mini label="Tax Amount" value={String(item.taxAmount)} />
                  </div>

                  {item.notes.length > 0 && (
                    <div className="mt-4 rounded-lg bg-zinc-900 p-3">
                      <p className="text-zinc-500 mb-1">Notes</p>
                      <div className="space-y-1">
                        {item.notes.map((note, index) => (
                          <p key={index} className="text-sm text-zinc-300">
                            {note}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">Verification Queue</h2>
          <div className="space-y-4">
            {verificationQueue.length === 0 ? (
              <p className="text-zinc-400">No manual verification items.</p>
            ) : (
              verificationQueue.map((item) => (
                <div key={item.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{item.id}</h3>
                      <p className="text-zinc-400">Task: {item.taskId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-600 text-sm w-fit">
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
                    <Mini label="Priority" value={item.priority} />
                    <Mini label="Worker" value={item.workerId} />
                    <Mini label="IRS Case" value={item.irsCaseId} />
                    <Mini label="Reason" value={item.reason} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">Action Log</h2>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-zinc-400">No logs yet.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <p className="font-medium">{log.action}</p>
                  <p className="text-sm text-zinc-400">
                    actor: {log.actorType} / {log.actorId}
                  </p>
                  <p className="text-sm text-zinc-400">
                    target: {log.targetType} / {log.targetId}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">{log.createdAt}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900">
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-zinc-300 break-all">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-2">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200 text-right break-all">{value}</span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-900 p-3">
      <p className="text-zinc-500">{label}</p>
      <p className="break-all">{value}</p>
    </div>
  );
}
