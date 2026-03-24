'use client';
import { worldTheme } from '../../lib/world/theme';
import WorldButton from './ui/WorldButton';

import { useAgentKernel } from '../../stores/agentKernelStore';

export default function TaskFeed() {
  const isRunning = useAgentKernel((s) => s.isRunning);
  const tickCount = useAgentKernel((s) => s.tickCount);
  const activeTasks = useAgentKernel((s) => s.activeTasks);
  const startSimulation = useAgentKernel((s) => s.startSimulation);
  const stopSimulation = useAgentKernel((s) => s.stopSimulation);
  const triggerTick = useAgentKernel((s) => s.triggerTick);
  const generateTask = useAgentKernel((s) => s.generateTask);
  const completeTask = useAgentKernel((s) => s.completeTask);

  return (
    <div className={`absolute bottom-24 left-1/2 z-30 w-[420px] -translate-x-1/2 ${worldTheme.panel} ${worldTheme.spacing.innerPadding}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className={worldTheme.sectionLabel}>
            Runtime Kernel
          </div>
          <div className="mt-1 text-sm text-white/70">Ticks: {tickCount}</div>
        </div>

        <div className="flex gap-2">
          <WorldButton
            onClick={isRunning ? stopSimulation : startSimulation}
            variant="ghost" size="sm"
          >
            {isRunning ? 'Stop' : 'Start'}
          </WorldButton>

          <WorldButton
            onClick={triggerTick}
            variant="ghost" size="sm"
          >
            Tick
          </WorldButton>

          <WorldButton
            onClick={generateTask}
            variant="ghost" size="sm"
          >
            New Task
          </WorldButton>
        </div>
      </div>

      <div className="mt-4 max-h-[260px] space-y-3 overflow-y-auto">
        {activeTasks.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/50">
            No active tasks.
          </div>
        ) : (
          activeTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className={`${worldTheme.heading}`}>{task.title}</div>
                  <div className="mt-1 text-xs text-white/50">
                    {task.requiredRole} • {task.district} • ${task.payoutAmount} • XP {task.xpAmount}
                  </div>
                </div>

                <div className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">
                  {task.status}
                </div>
              </div>

              {task.status === 'assigned' ? (
                <WorldButton
                  onClick={() => completeTask(task.id)}
                  className="mt-3 rounded-md border border-emerald-400/20 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200"
                >
                  Complete
                </WorldButton>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}