
export function AcademyV5Marketplace() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-800 bg-slate-950/50">
        <h2 className="text-sm font-bold text-slate-200">Curriculum & Creative Marketplace</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="border border-slate-800 p-3 rounded bg-slate-950/30 hover:border-purple-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Curriculum Pack</span>
            <span className="text-[10px] text-slate-500 font-mono">0.85 ROI</span>
          </div>
          <h4 className="text-sm font-bold text-slate-300">Hyper-Scale Content Hooks v2</h4>
          <p className="text-xs text-slate-500 mt-1">150+ vetted hooks for short-form narrative scaling.</p>
        </div>
        <div className="border border-slate-800 p-3 rounded bg-slate-950/30 hover:border-amber-500/50 transition-all cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Prompt Pack</span>
            <span className="text-[10px] text-slate-500 font-mono">0.92 ROI</span>
          </div>
          <h4 className="text-sm font-bold text-slate-300">Cinematic Storyboard Prompts</h4>
          <p className="text-xs text-slate-500 mt-1">Midjourney v12.0 core prompts for visual storytelling.</p>
        </div>
      </div>
    </div>
  )
}
