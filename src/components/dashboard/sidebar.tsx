"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Layers, 
  Inbox, 
  Cpu, 
  Settings, 
  Activity, 
  CheckSquare, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Inbox", icon: Inbox, path: "/dashboard" },
  { name: "Pipeline", icon: Layers, path: "/dashboard/pipeline" },
  { name: "Agent Console", icon: Activity, path: "/dashboard/agent-console" },
  { name: "Review Board", icon: CheckSquare, path: "/dashboard/review" },
  { name: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
  { name: "AI Skills", icon: Cpu, path: "/dashboard/skills" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen glass-panel fixed left-0 top-0 flex flex-col p-4 z-50">
      <div className="flex items-center gap-3 mb-10 px-2 pt-2">
        <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.5)]">
          <Sparkles className="w-5 h-5 text-black" />
        </div>
        <h1 className="text-xl font-bold tracking-tight neon-glow">AutoBots</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center justify-between group px-3 py-2.5 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400 neon-border" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-cyan-400 shadow-[0_0_10px_rgba(0,242,255,0.3)]" : "")} />
                <span className="font-medium">{item.name}</span>
              </div>
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )} />
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-zinc-800">
        <Link
          href="/dashboard/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors",
            pathname === "/dashboard/settings" ? "text-cyan-400" : ""
          )}
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </Link>
        <div className="mt-4 px-3 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-bold">Orchestrator Active</span>
          </div>
          <p className="text-xs text-zinc-500">v1.2.4-stable</p>
        </div>
      </div>
    </div>
  );
}
