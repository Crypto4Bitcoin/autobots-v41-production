import React from 'react';
import Link from 'next/link';
import VoiceConversationUI from '@/components/VoiceConversationUI';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-[#0a0a0a] p-6 flex flex-col">
        <div className="text-2xl font-black mb-12 tracking-tighter flex items-center gap-2">
           <div className="w-5 h-5 bg-blue-500 rounded-sm transform rotate-12"></div>
           <Link href="/">AutoBots</Link>
        </div>
        <nav className="space-y-4 flex-1">
          <Link href="/dashboard" className="block text-gray-400 hover:text-white transition cursor-pointer">Home</Link>
          <Link href="/dashboard/instant" className="block text-gray-400 hover:text-white transition cursor-pointer">Instant Actions</Link>
          <Link href="/dashboard/results" className="block text-gray-400 hover:text-white transition cursor-pointer">Results</Link>
          <Link href="/workers" className="block text-gray-400 hover:text-white transition cursor-pointer">Workers</Link>
          <Link href="/builder" className="block text-gray-400 hover:text-white transition cursor-pointer">Workflow Builder</Link>
          <Link href="/marketplace" className="block text-gray-400 hover:text-white transition cursor-pointer">Marketplace</Link>
          <Link href="/briefings" className="block text-gray-400 hover:text-white transition cursor-pointer">Briefings</Link>
          <Link href="/team" className="block text-gray-400 hover:text-white transition cursor-pointer">Team Workspace</Link>
          <div className="pt-6 mt-6 border-t border-gray-800"></div>
          <Link href="/settings" className="block text-gray-400 hover:text-white transition cursor-pointer">Settings</Link>
          <Link href="/pricing" className="block text-blue-400 hover:text-blue-300 font-medium transition cursor-pointer">Upgrade / Billing</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Command Bar */}
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-[#0a0a0a]/80 backdrop-blur shrink-0 z-10">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-lg flex items-center px-4 py-2">
            <span className="text-gray-500 mr-3">✦</span>
            <input 
              type="text" 
              placeholder="Paste link or describe task to run instantly..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-200"
            />
          </div>
          <div className="flex items-center gap-4">
             <VoiceConversationUI />
             <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">AB</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
