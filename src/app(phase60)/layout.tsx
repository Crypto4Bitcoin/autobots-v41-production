import React from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050505] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 bg-[#0a0a0a] p-6 flex flex-col">
        <div className="text-2xl font-black mb-12 tracking-tighter">AutoBots</div>
        <nav className="space-y-4 flex-1">
          <div className="text-blue-500 font-semibold cursor-pointer">Overview</div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">AI Workers</div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Workflows</div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Marketplace</div>
          <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Insights</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Command Bar */}
        <header className="h-20 border-b border-gray-800 flex items-center px-8 bg-[#0a0a0a]/80 backdrop-blur">
          <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-lg flex items-center px-4 py-2">
            <span className="text-gray-500 mr-3">??</span>
            <input 
              type="text" 
              placeholder="Monitor crypto news and send me a daily summary..." 
              className="bg-transparent border-none outline-none flex-1 text-sm text-gray-200"
            />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
