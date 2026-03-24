"use client";

import React, { useState } from 'react';

export function CreatorSearchBar() {
  const [command, setCommand] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCreate = async () => {
    if (!command) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/media/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      setResult({ status: "error", message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm mb-12">
      <h2 className="text-white font-semibold mb-4 flex items-center">
        <span className="bg-blue-500 w-2 h-2 rounded-full mr-2 animate-pulse"></span>
        Search or Create
      </h2>
      <div className="flex gap-4">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="e.g. create 30 second video about bitcoin ETF"
          className="flex-1 bg-black/40 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
        >
          {loading ? "Creating..." : "Create Video"}
        </button>
      </div>

      {result && (
        <div className="mt-6 bg-black/60 p-4 rounded-xl border border-gray-800 overflow-hidden">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">
            Mission Graph: {result.topic || "Processing"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {result.workflow_results?.map((step, i) => (
              <div key={i} className="bg-gray-900/80 p-2 rounded-lg border border-gray-800 flex items-center group hover:border-blue-500/50 transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[10px] text-gray-300 font-mono truncate">{step.step}</span>
              </div>
            ))}
          </div>
          {result.status === "success" && (
             <div className="mt-4 text-[10px] text-emerald-400 font-medium">✓ Content Lifecycle Initiated</div>
          )}
        </div>
      )}
    </div>
  );
}
