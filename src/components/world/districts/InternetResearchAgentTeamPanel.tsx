'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useInternetResearchTeamStore } from '@/stores/internetResearchTeamStore';

export function InternetResearchAgentTeamPanel() {
  const {
    teamName,
    enabled,
    currentQuery,
    jobs,
    brain,
    lastRunAt,
    setEnabled,
    setCurrentQuery,
    runJob,
    clearJobs,
  } = useInternetResearchTeamStore();

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>{teamName}</h2>
      <p className="mt-1 text-zinc-400">
        Internet-only team for real-life task research, content composition, verification, and marketplace packaging.
      </p>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4`.trim()}>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Research Query / Job</label>
            <input
              value={currentQuery}
              onChange={(e) => setCurrentQuery(e.target.value)}
              placeholder="real life task, local service, product idea..."
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white outline-none"
            />
          </div>

          <div className="flex gap-3">
            <WorldButton
              onClick={() => setEnabled(!enabled)}
              className={`rounded-lg px-4 py-2 text-sm ${enabled ? 'bg-emerald-700' : 'bg-zinc-700'}`}
            >
              {enabled ? 'Team ON' : 'Team OFF'}
            </WorldButton>

            <WorldButton
              onClick={() => runJob()}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm"
            >
              Run Team
            </WorldButton>

            <WorldButton
              onClick={() => clearJobs()}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm"
            >
              Clear
            </WorldButton>
          </div>
        </div>

        <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4`.trim()}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat label="Brain ID" value={brain.id} />
            <Stat label="Capacity" value={`${brain.maxAssets}`} />
            <Stat label="Stored" value={`${brain.storedAssets}`} />
            <Stat label="Value" value={`${brain.valueScore}`} />
          </div>

          <div className="mt-4">
            <p className={`${worldTheme.sectionLabel}text-sm `.trim()}>Brain Storage</p>
            <div className="mt-2 h-4 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-cyan-500"
                style={{ width: `${brain.storagePercent}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-zinc-300">{brain.storagePercent}%</p>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <Stat label="Links" value={`${brain.linksStored}`} />
            <Stat label="Pictures" value={`${brain.picturesStored}`} />
            <Stat label="Locked" value={String(brain.locked)} />
          </div>

          <div className="mt-4 text-sm text-zinc-400">
            Last Run: {lastRunAt ?? 'none'}
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {jobs.length === 0 ? (
          <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400`.trim()}>
            No internet research jobs yet.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4`.trim()}>
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{job.sourceQuery}</h3>
                  <p className="text-zinc-400">{job.id}</p>
                </div>
                <span className="rounded-full bg-purple-700 px-3 py-1 text-xs w-fit">
                  {job.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <Stat label="Assets" value={String(job.assets.length)} />
                <Stat label="Verified" value={String(job.verified)} />
                <Stat label="Compose" value={job.composedPack ? 'ready' : 'none'} />
                <Stat label="Market" value={job.marketPack ? 'ready' : 'none'} />
                <Stat label="Updated" value={job.updatedAt} />
              </div>

              {job.marketPack && (
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="font-medium">{job.marketPack.title}</p>
                  <p className="text-sm text-zinc-400 mt-1">{job.marketPack.description}</p>
                  <p className="text-sm text-emerald-400 mt-2">${job.marketPack.price}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className={`${worldTheme.panel} rounded-xl bg-zinc-900 border border-zinc-800 p-3`.trim()}>
      <p className={`${worldTheme.sectionLabel}`.trim()}>{label}</p>
      <p className="mt-1 font-medium break-all">{value}</p>
    </div>
  );
}
