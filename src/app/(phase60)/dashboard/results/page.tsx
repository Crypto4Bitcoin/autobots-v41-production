"use client";
import React, { useState } from 'react';

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("Summary");
  const runs = [
    {
      id: "run-1",
      title: "YouTube Content Kit",
      source: "youtube",
      status: "completed",
      time: "2 minutes ago",
      outputs: ["Summary", "Transcript", "Blog", "X Thread"],
    },
    {
      id: "run-2",
      title: "Deep Research Report",
      source: "article",
      status: "completed",
      time: "12 minutes ago",
      outputs: ["Summary", "Research Notes", "Fact Check"],
    },
  ];

  const handleAction = (action: string) => {
    alert(`${action} triggered for ${activeTab}.`);
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Results</h1>
          <p className="mt-2 text-sm text-gray-400">
            Review generated outputs from recent runs.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="space-y-4">
            {runs.map((run) => (
              <button
                key={run.id}
                className="w-full rounded-2xl border border-gray-800 bg-gray-950 p-4 text-left hover:bg-gray-900 focus:border-emerald-500 transition"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-white">{run.title}</h2>
                  <span className="rounded-full border border-emerald-800 bg-emerald-950 px-2 py-1 text-[10px] uppercase tracking-wide text-emerald-300">
                    {run.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Source: {run.source} • {run.time}
                </p>
              </button>
            ))}
          </aside>

          <div className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold">Generated Outputs</h2>
              <p className="mt-2 text-sm text-gray-400">
                Open, copy, export, or turn results into a worker.
              </p>
            </div>

            <div className="mb-6 flex flex-wrap gap-3">
              {["Summary", "Transcript", "Blog", "X Thread", "Research Notes"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${activeTab === tab ? 'bg-white text-black border-white font-medium' : 'border-gray-800 text-gray-300 hover:bg-gray-900'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-gray-800 bg-black/40 p-5">
              <h3 className="mb-3 text-lg font-medium">{activeTab}</h3>
              <p className="text-sm leading-7 text-gray-300">
                Mock content payload for {activeTab}. This run generated a structured package from the source input.
                You can copy the output, export it, publish it, or convert this run into a persistent worker.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => handleAction('Copy')} className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black hover:bg-gray-200">
                Copy
              </button>
              <button onClick={() => handleAction('Export')} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-900">
                Export
              </button>
              <button onClick={() => handleAction('Publish')} className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-900">
                Publish
              </button>
              <button onClick={() => handleAction('Turn Into Worker')} className="rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-400 hover:bg-blue-900/30">
                ⚡ Turn Into Worker
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
