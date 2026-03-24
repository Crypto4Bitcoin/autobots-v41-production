
import { AcademyV5Summary } from "@/components/academy-v5/AcademyV5Summary"
import { AcademyV5Schools } from "@/components/academy-v5/AcademyV5Schools"
import { AcademyV5Trust } from "@/components/academy-v5/AcademyV5Trust"
import { AcademyV5Marketplace } from "@/components/academy-v5/AcademyV5Marketplace"
import { AcademyV5Identity } from "@/components/academy-v5/AcademyV5Identity"

export default function AcademyV5Page() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30">
      {/* Header */}
      <div className="border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-black text-xs">Ω</span>
            </div>
            <div>
              <h1 className="text-sm font-black text-white tracking-widest uppercase italic">Omega Academy V5</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Federated Intelligence Network</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-cyan-400">Network Dashboard</span>
            <span className="hover:text-white cursor-pointer transition-colors">Shared Marketplace</span>
            <span className="hover:text-white cursor-pointer transition-colors">Trust Mesh</span>
            <div className="w-px h-4 bg-slate-800" />
            <span className="bg-slate-800 text-slate-200 px-3 py-1 rounded-full border border-slate-700">did:omega-001</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        <AcademyV5Summary />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AcademyV5Schools />
            <AcademyV5Marketplace />
          </div>
          <div className="space-y-6">
            <AcademyV5Trust />
            <AcademyV5Identity />
            
            {/* Network Console Log */}
            <div className="bg-black border border-slate-800 rounded-lg p-4 font-mono text-[10px] h-64 overflow-y-auto">
              <p className="text-slate-500 mb-2">--- NETWORK_ORCHESTRATION_LOG ---</p>
              <p className="text-cyan-500">[14:56:02] INITIALIZING_FEDERATION_HANDSHAKE...</p>
              <p className="text-blue-500">[14:56:04] VERIFYING_SCHOOL_IDENTITY: did:omega-001</p>
              <p className="text-green-500">[14:56:05] TRUST_LINK_ESTABLISHED: tier=strategic</p>
              <p className="text-purple-500">[14:56:08] FETCHING_MARKET_CURRICULUM: focus=ai_hooks</p>
              <p className="text-amber-500">[14:56:10] CROSS_SCHOOL_POST_SYNC: slot=18:00_UTC</p>
              <p className="text-slate-400 mt-2">_</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
