'use client';
import WorldButton from '../ui/WorldButton';
import { worldTheme } from '../../../lib/world/theme';

import { useResearchDepartmentStore } from '@/stores/researchDepartmentStore';

export function ResearchAgentDepartmentPanel() {
  const {
    decisionMode,
    automaticDecisionEnabled,
    selectedMode,
    currentInputUrl,
    agentFrontName,
    status,
    jobs,
    setCurrentInputUrl,
    setDecisionMode,
    setAutomaticDecisionEnabled,
    setSelectedMode,
    setAgentFrontName,
    submitResearch,
    clearResearchJobs,
  } = useResearchDepartmentStore();

  return (
    <section className={`${worldTheme.panel} `.trim()}>
      <h2 className={`${worldTheme.heading} text-2xl`.trim()}>Research Agent Department</h2>
      <p className="mt-1 text-zinc-400">
        RED = manual link mode. BLUE = automatic decision mode using the first name in front of AGENT.
      </p>

      <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4 space-y-4`.trim()}>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Research Link Box</label>
            <input
              value={currentInputUrl}
              onChange={(e) => setCurrentInputUrl(e.target.value)}
              placeholder="Paste your link here for RED mode..."
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">First Name in front of AGENT</label>
            <input
              value={agentFrontName}
              onChange={(e) => setAgentFrontName(e.target.value)}
              placeholder="Alpha"
              className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-2 text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
              <p className={`${worldTheme.sectionLabel}text-sm  mb-2`.trim()}>Decision Switch</p>
              <div className="flex gap-2">
                <WorldButton
                  onClick={() => setDecisionMode('RED')}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    decisionMode === 'RED' ? 'bg-red-700' : 'bg-zinc-700'
                  }`}
                >
                  RED
                </WorldButton>
                <WorldButton
                  onClick={() => setDecisionMode('BLUE')}
                  className={`rounded-lg px-4 py-2 text-sm ${
                    decisionMode === 'BLUE' ? 'bg-blue-700' : 'bg-zinc-700'
                  }`}
                >
                  BLUE
                </WorldButton>
              </div>
            </div>

            <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
              <p className={`${worldTheme.sectionLabel}text-sm  mb-2`.trim()}>Automatic Decision</p>
              <WorldButton
                onClick={() => setAutomaticDecisionEnabled(!automaticDecisionEnabled)}
                className={`rounded-lg px-4 py-2 text-sm ${
                  automaticDecisionEnabled ? 'bg-emerald-700' : 'bg-zinc-700'
                }`}
              >
                {automaticDecisionEnabled ? 'ON' : 'OFF'}
              </WorldButton>
            </div>
          </div>

          <div className="rounded-lg bg-zinc-900 border border-zinc-800 p-3">
            <p className={`${worldTheme.sectionLabel}text-sm  mb-2`.trim()}>BLUE mode option</p>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as 'e2e' | 'control-screen')}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2"
            >
              <option value="e2e">choose this (E2E)</option>
              <option value="control-screen">or that control screen</option>
            </select>
          </div>

          <div className="flex gap-3">
            <WorldButton
              onClick={() => submitResearch()}
              className="rounded-lg bg-blue-700 px-4 py-2 text-sm"
            >
              Run Research Department
            </WorldButton>

            <WorldButton
              onClick={() => clearResearchJobs()}
              className="rounded-lg bg-zinc-700 px-4 py-2 text-sm"
            >
              Clear
            </WorldButton>
          </div>
        </div>

        <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4`.trim()}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <Stat label="Status" value={status} />
            <Stat label="Decision" value={decisionMode} />
            <Stat label="Mode" value={selectedMode} />
            <Stat label="Jobs" value={String(jobs.length)} />
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm">
            <p className={`${worldTheme.sectionLabel}`.trim()}>Resolution Rule</p>
            <p className="mt-2 text-zinc-300">
              {decisionMode === 'RED'
                ? currentInputUrl
                  ? `RED selected. Using your manual link: ${currentInputUrl}`
                  : 'RED selected. Waiting for manual link.'
                : automaticDecisionEnabled
                ? `BLUE selected. Auto search will use: ${agentFrontName} AGENT research`
                : 'BLUE selected, but automatic decision is OFF.'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {jobs.length === 0 ? (
          <div className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400`.trim()}>
            No research jobs yet.
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className={`${worldTheme.panel} rounded-xl border border-zinc-800 bg-zinc-950 p-4`.trim()}>
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{job.id}</h3>
                  <p className="text-zinc-400">
                    {job.sourceType} • {job.mode} • {job.decisionMode}
                  </p>
                </div>
                <span className="rounded-full bg-purple-700 px-3 py-1 text-xs w-fit">
                  {job.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <Stat label="Screenshots" value={String(job.screenshots.length)} />
                <Stat label="Published" value={job.publishedTargets.join(', ') || 'none'} />
                <Stat label="Summary" value={job.summaryPack?.title ?? 'none'} />
                <Stat label="Updated" value={job.updatedAt} />
              </div>

              {job.screenshots.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  {job.screenshots.map((shot) => (
                    <div
                      key={shot.id}
                      className="rounded-lg border border-zinc-800 bg-zinc-900 p-3"
                    >
                      <p className="text-sm font-medium">{shot.category}</p>
                      <p className={`${worldTheme.sectionLabel}text-xs  break-all mt-1`.trim()}>
                        {shot.ipfsCid ?? 'no cid'}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {job.summaryPack && (
                <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="font-medium">{job.summaryPack.title}</p>
                  <p className="text-sm text-zinc-400 mt-2">{job.summaryPack.shortSummary}</p>
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
