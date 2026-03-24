"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorldStore } from '../stores/worldStore';

export default function AutoBotsFrontend() {
  const router = useRouter();
  const world = useWorldStore();
  const voiceOnlyMode = true;
  const [command, setCommand] = useState("Create a market intelligence workflow, collect the strongest signals, summarize them, store the findings to strategic memory, and prepare an executive briefing.");
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleVoiceCommand = async (transcript: string) => {
    setStatusMessage("Resolving voice intent...");
    const intentData = await handleApiAction('/api/voice/intent', 'POST', { transcript });
    
    if (intentData && intentData.routing) {
      const { routing } = intentData;
      setStatusMessage(`Intent: ${intentData.intent} -> ${routing.target}`);
      
      if (routing.success) {
        if (routing.type === 'route') {
          router.push(routing.target);
        } else if (routing.type === 'api') {
          await handleApiAction(routing.target, 'POST', intentData.command.parameters || {});
        }
      } else {
        setStatusMessage("Routing failed");
      }
    }
  };

  const handleApiAction = async (endpoint: string, method = 'POST', body: unknown = null) => {
    setIsProcessing(true);
    setStatusMessage(`Requesting ${endpoint}...`);
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : null,
      });
      
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      
      const data = await response.json();
      setStatusMessage(`Success: ${endpoint} executed.`);
      return data;
    } catch (error: any) {
      console.error(error);
      setStatusMessage(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(""), 5000);
    }
  };

  const startVoiceSession = async () => {
    await handleApiAction('/api/voice/start');
  };
  
  const handleLaunch = async () => {
    await handleApiAction('/api/workflows/create', 'POST', { command });
    router.push(`/dashboard/pipeline?q=${encodeURIComponent(command)}`);
  };

  const layers = [
    { title: "Kernel", subtitle: "Execution, governance, replay, and reliability", items: ["Workflow Runtime", "State Engine", "Policy Engine", "Observability", "Execution Fabric"] },
    { title: "Global Runtime", subtitle: "Multi-region orchestration and failover", items: ["Regional Execution Planes", "Latency Routing", "Global Control Plane", "Federation Gateways"] },
    { title: "Autonomous Intelligence", subtitle: "Observation, hypothesis, simulation, and playbook evolution", items: ["Observation Engine", "Hypothesis Engine", "Simulation Engine", "Playbook Evolution"] },
    { title: "Cognitive Core", subtitle: "Tradeoff-aware strategy selection", items: ["Context Engine", "Goal Engine", "Reasoning Engine", "Decision Engine"] },
    { title: "Universal Agent Fabric", subtitle: "Distributed agent workforce across runtimes and regions", items: ["Identity Layer", "Communication Mesh", "Discovery Service", "Trust Layer"] },
    { title: "Physical Interface", subtitle: "On-site action through devices, sensors, and edge nodes", items: ["Device Registry", "Edge Execution", "Sensor Fabric", "Safety Controls"] },
  ];

  const capabilities = [
    "Voice-first orchestration", "Screenshot and file ingestion", "Memory-driven execution", "Policy and approval control", "Browser and API automation", "Simulation before action", "Distributed multi-agent routing", "Cross-region failover", "Replay and traceability", "Self-improving playbooks", "Cross-organization federation", "Physical-world automation",
  ];

  const panels = [
    { title: "Voice Command Center", body: "Talk to AutoBots naturally.", accent: "Voice Active", action: startVoiceSession },
    { title: "Mission Graph", body: "See every workflow as a live execution graph.", accent: "Live Orchestration", action: () => router.push('/dashboard/pipeline') },
    { title: "Memory Intelligence", body: "Browse episodic, semantic, strategic memory.", accent: "Multi-Class Memory", action: () => router.push('/autonomous') },
    { title: "Autonomy Sandbox", body: "Simulate strategies, test agent combinations.", accent: "Safe Simulation", action: () => router.push('/autonomous') },
    { title: "Sovereign Command", body: "Access the transcended civilization core.", accent: world.civilizationStatus === 'Ascended' ? "SOVEREIGN ACTIVE" : "SOVEREIGN_LOCKED", action: () => router.push('/sovereign') }
  ];

  const navigation = [
    { name: "Command", path: "/" }, { name: "Sovereign", path: "/sovereign" }, { name: "Runtime", path: "/autonomous" }, { name: "Agents", path: "/workforce" }, { name: "Workflows", path: "/dashboard/pipeline" }, { name: "Memory", path: "/autonomous" }, { name: "Governance", path: "/insights" }, { name: "Observability", path: "/autonomous" }, { name: "Federation", path: "/marketplace" }, { name: "Physical Ops", path: "/builder" }, { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_32%),radial-gradient(circle_at_right,rgba(59,130,246,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_28%)]" />

      {statusMessage && (
        <div className="fixed top-4 right-4 z-50 rounded-2xl border border-emerald-400/20 bg-slate-950/80 p-4 backdrop-blur shadow-2xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${statusMessage.includes('Error') ? 'bg-red-400' : 'bg-emerald-400'} animate-pulse`} />
            <p className="text-sm font-medium">{statusMessage}</p>
          </div>
        </div>
      )}

      <div className="relative flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950/80 backdrop-blur xl:flex xl:flex-col">
          <div className="border-b border-white/10 p-6">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 text-lg font-bold text-slate-950 shadow-lg shadow-emerald-500/20">A</div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-300/80">AutoBots</p>
                <h1 className="text-xl font-semibold">Planetary Runtime</h1>
              </div>
            </div>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((item, index) => (
              <button key={item.name} onClick={() => router.push(item.path)} className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition hover:bg-white/5">
                <span>{item.name}</span>
                <span className="text-xs text-slate-500">0{index + 1}</span>
              </button>
            ))}
          </nav>
        </aside>
        <main className="relative flex-1">
          <header className="border-b border-white/10 bg-slate-950/60 backdrop-blur">
            <div className="mx-auto flex max-w-7xl px-4 py-5 flex-row items-center justify-between">
              <h2 className="text-3xl font-semibold tracking-tight">Planetary Intelligence Deck</h2>
              <button onClick={startVoiceSession} className="rounded-2xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-violet-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg">Start Voice Session</button>
            </div>
          </header>
          <section className="mx-auto max-w-7xl px-4 py-8 grid gap-6 grid-cols-5">
            {panels.map((panel) => (
              <button key={panel.title} onClick={panel.action} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/[0.07] text-left h-full">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{panel.accent}</p>
                <h3 className="mt-3 text-xl font-semibold">{panel.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{panel.body}</p>
              </button>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}
