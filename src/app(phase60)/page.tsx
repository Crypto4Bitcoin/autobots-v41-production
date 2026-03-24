import React from 'react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Build AI workers that run tasks for you 24/7.
        </h1>
        <p className="text-xl text-gray-400">
          Stop prompting. Start managing a resilient, global AI workforce.
        </p>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center shadow-2xl mt-12">
          <input 
            type="text" 
            placeholder="Paste a link or describe a task..." 
            className="flex-1 bg-transparent border-none outline-none text-xl p-4 text-white placeholder-gray-500"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:scale-105">
            Automate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">? Create Content Automatically</h3>
            <p className="text-gray-400 text-sm">Paste a YouTube link and get a full transcript, blog, tweets, and clips.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">?? Research Anything Instantly</h3>
            <p className="text-gray-400 text-sm">Analyze articles, PDFs, or videos and extract cited insights instantly.</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">?? Automate Business Tasks</h3>
            <p className="text-gray-400 text-sm">Build AI workflows that monitor competitors, analyze markets, and act.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
