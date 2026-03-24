"use client";
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InstantActionsPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      router.push('/dashboard/results');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <h1 className="text-3xl font-bold text-white mb-8">Instant Actions</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-lg mb-12">
        <label className="block text-gray-400 text-sm font-medium mb-3">Paste a link or describe a task</label>
        <div className="flex gap-4">
           <input 
             type="text" 
             className="flex-1 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition" 
             defaultValue="https://youtube.com/watch?v=example"
           />
        </div>
      </div>

      <h2 className="text-xl font-bold text-white mb-6">What should AutoBots do with this?</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Create Content</h3>
          {[
            { title: "Generate Content Kit", desc: "Turn the source into blogs, posts, and summaries." },
            { title: "Blog Post", desc: "Write a long-form article based on the facts." },
            { title: "X / Twitter Thread", desc: "Extract the best hooks and create a thread." }
          ].map((act, i) => (
            <label key={i} className="flex items-start p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 cursor-pointer transition relative has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-900/20">
              <input type="checkbox" className="mt-1 mr-4 accent-emerald-500 w-4 h-4" defaultChecked={i === 0} />
              <div>
                <div className="text-white font-medium">{act.title}</div>
                <div className="text-gray-500 text-sm mt-1">{act.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Analyze & Research</h3>
          {[
            { title: "Summary", desc: "Extract the core thesis and key points." },
            { title: "Fact Check", desc: "Validate claims against known knowledge bases." },
            { title: "Research Report", desc: "Generate a deep comparison and analysis document." }
          ].map((act, i) => (
            <label key={i} className="flex items-start p-4 rounded-xl border border-gray-800 bg-gray-900/50 hover:bg-gray-800 cursor-pointer transition relative has-[:checked]:border-blue-500 has-[:checked]:bg-blue-900/20">
              <input type="checkbox" className="mt-1 mr-4 accent-blue-500 w-4 h-4" />
              <div>
                <div className="text-white font-medium">{act.title}</div>
                <div className="text-gray-500 text-sm mt-1">{act.desc}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-gray-800">
         <button 
           onClick={handleRun}
           disabled={isProcessing}
           className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-gray-200 transition text-lg shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
         >
           {isProcessing ? 'Processing Run...' : 'Run Selected Actions (1)'}
         </button>
      </div>
    </div>
  );
}
