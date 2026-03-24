"use client";

import React, { useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { X, Search, Link2, FileUp, Type, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewItemModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("url");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl glass-panel shadow-[0_0_50px_rgba(0,0,0,0.5)] border-zinc-800">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center ring-1 ring-cyan-500/30">
              <PlusIcon className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold">New Pipeline Item</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex p-1 bg-zinc-900 rounded-xl mb-6 border border-zinc-800/50">
            {[
              { id: "url", label: "Link/URL", icon: Link2 },
              { id: "file", label: "Media File", icon: FileUp },
              { id: "text", label: "Idea/Raw Text", icon: Type },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold transition-all rounded-lg",
                  activeTab === tab.id ? "bg-zinc-800 text-cyan-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {activeTab === "url" && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">Source Link</label>
                <input 
                  type="text" 
                  placeholder="Paste YouTube, X, or Article URL..." 
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-zinc-700"
                />
              </div>
            )}
            
            {activeTab === "file" && (
              <div className="border-2 border-dashed border-zinc-800 rounded-xl p-10 flex flex-col items-center justify-center gap-3 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-cyan-400 transition-colors">
                  <FileUp className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-zinc-400">Drag and drop file</p>
                <p className="text-xs text-zinc-600">MP4, MP3, WAV, PDF up to 100MB</p>
              </div>
            )}

            {activeTab === "text" && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-zinc-500">Content Draft / Idea</label>
                <textarea 
                  placeholder="Describe your content idea in detail..." 
                  className="w-full h-32 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder:text-zinc-700 resize-none"
                />
              </div>
            )}
            
            <div className="flex items-center gap-2 py-4">
              <input type="checkbox" className="w-4 h-4 rounded bg-zinc-900 border-zinc-800 text-cyan-500 focus:ring-offset-0 focus:ring-cyan-500" />
              <span className="text-xs text-zinc-400">High priority execution (Use for time-sensitive trends)</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-950/50 border-t border-zinc-900 rounded-b-lg flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase">
             <Sparkles className="w-3 h-3 text-cyan-600" />
             AI Agents Ready
          </div>
          <div className="flex gap-3">
             <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-300">Cancel</button>
             <button className="px-6 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] text-xs">
                Launch Pipeline
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: unknown) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
