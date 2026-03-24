"use client";
import React, { useState } from 'react';

export default function WorkflowBuilder() {
  const [nodes, setNodes] = useState([
    { id: 1, type: "trigger", title: "New YouTube Video", icon: "▶" },
    { id: 2, type: "action", title: "Speech to Text", icon: "🎤" },
    { id: 3, type: "action", title: "Extract Key Points", icon: "🧠" }
  ]);
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const handleAddNode = (type: string, title: string, icon: string) => {
    setNodes([...nodes, { id: nodes.length + 1, type, title, icon }]);
  };

  const handleDeleteNode = (id: number) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (activeNode === id) setActiveNode(null);
  };

  const handleSave = () => {
    alert("Workflow saved successfully.");
  };

  const handleRun = () => {
    alert("Running Workflow test execution.");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] -m-8 text-white relative">
      <div className="h-14 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-6 z-10">
         <div className="flex items-center space-x-4">
            <h1 className="font-bold text-lg">Content Repurposer</h1>
            <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs">Draft</span>
         </div>
         <div className="flex items-center space-x-3">
            <button className="text-gray-400 hover:text-white px-3 py-1 text-sm transition">Discard</button>
            <button onClick={handleRun} className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">Test Run</button>
            <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow-[0_0_10px_rgba(37,99,235,0.4)]">Save Workflow</button>
         </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="w-64 border-r border-gray-800 bg-gray-900/50 p-4 overflow-y-auto flex flex-col z-10 shadow-xl">
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Triggers</h3>
           <div className="space-y-2 mb-6">
              {[
                { title: "Webhook", icon: "🔗" },
                { title: "Schedule", icon: "⏱" },
                { title: "YouTube", icon: "▶" }
              ].map(item => (
                <div key={item.title} onClick={() => handleAddNode('trigger', item.title, item.icon)} className="flex items-center space-x-3 p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-600 cursor-grab transition">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              ))}
           </div>
           
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Actions</h3>
           <div className="space-y-2">
              {[
                { title: "HTTP Request", icon: "🌐" },
                { title: "LLM Prompt", icon: "🧠" },
                { title: "Speech to Text", icon: "🎤" },
                { title: "Post to X", icon: "🐦" }
              ].map(item => (
                <div key={item.title} onClick={() => handleAddNode('action', item.title, item.icon)} className="flex items-center space-x-3 p-3 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-600 cursor-grab transition">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium">{item.title}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="flex-1 bg-[#0a0a0a] relative overflow-hidden flex flex-col items-center pt-12 cursor-pointer pattern-dots pattern-gray-800 pattern-bg-transparent pattern-size-4">
           {nodes.map((node, i) => (
             <div key={node.id} className="relative flex flex-col items-center">
               <div 
                 onClick={() => setActiveNode(node.id)}
                 className={`w-64 bg-gray-900 p-4 rounded-xl shadow-lg border cursor-pointer transition ${activeNode === node.id ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-gray-700 hover:border-gray-500'}`}
               >
                 <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center space-x-2">
                     <span className="p-1 rounded bg-gray-800 text-sm">{node.icon}</span>
                     <span className="text-xs text-gray-400 capitalize">{node.type}</span>
                   </div>
                   <button onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }} className="text-gray-600 hover:text-red-400 font-bold p-1">⋮</button>
                 </div>
                 <div className="font-medium text-white">{node.title}</div>
               </div>
               
               {i < nodes.length - 1 && (
                 <div className="h-8 w-px bg-gray-700 my-2 relative">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
                     <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                     </svg>
                   </div>
                 </div>
               )}
             </div>
           ))}
        </div>

        {activeNode && (
          <div className="w-80 border-l border-gray-800 bg-gray-900/90 p-6 overflow-y-auto z-10 shadow-2xl backdrop-blur">
             <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg text-white">Node Settings</h2>
                <button onClick={() => setActiveNode(null)} className="text-gray-500 hover:text-white">✕</button>
             </div>
             
             <div className="space-y-6">
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Node Name</label>
                   <input type="text" defaultValue={nodes.find(n => n.id === activeNode)?.title} className="w-full bg-black border border-gray-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <button onClick={() => handleDeleteNode(activeNode)} className="w-full mt-4 bg-red-900/20 text-red-500 hover:bg-red-900/40 p-2 rounded border border-red-900 transition">Delete Node</button>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
