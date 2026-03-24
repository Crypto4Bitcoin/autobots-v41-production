
export function AcademyV5Schools() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
        <h2 className="text-sm font-bold text-slate-200">School Federation Registry</h2>
        <button className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded transition-colors">Onboard Partner</button>
      </div>
      <table className="w-full text-xs text-left">
        <thead className="text-slate-500 uppercase bg-slate-950/30">
          <tr>
            <th className="px-4 py-3">School Name</th>
            <th className="px-4 py-3">Niche</th>
            <th className="px-4 py-3">Region</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Trust Tier</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          <tr className="hover:bg-slate-800/50 transition-colors">
            <td className="px-4 py-3 font-medium text-slate-300">Omega Prime Academy</td>
            <td className="px-4 py-3 text-slate-500 font-mono">Core/Gov</td>
            <td className="px-4 py-3 text-slate-500">us-east-1</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-cyan-900/30 text-cyan-400 text-[10px]">Strategic</span></td>
            <td className="px-4 py-3 text-cyan-500">full_federated</td>
          </tr>
          {/* Mock secondary entries */}
          <tr className="hover:bg-slate-800/50 transition-colors">
            <td className="px-4 py-3 font-medium text-slate-300">Neo-Fin Academy</td>
            <td className="px-4 py-3 text-slate-500 font-mono">Markets</td>
            <td className="px-4 py-3 text-slate-500">eu-west-1</td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400 text-[10px]">Trusted</span></td>
            <td className="px-4 py-3 text-blue-500">trusted</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
