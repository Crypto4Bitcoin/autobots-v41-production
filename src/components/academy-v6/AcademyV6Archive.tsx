
export function AcademyV6Archive({ archive }: { archive: unknown[] }) {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="p-4 border-b border-slate-800 bg-black">
        <h2 className="text-sm font-bold text-slate-200">Raw Innovation Manifest</h2>
      </div>
      <div className="p-4 font-mono text-[10px] h-96 overflow-y-auto bg-black/40">
        <pre className="text-slate-500 whitespace-pre-wrap">{JSON.stringify(archive, null, 2)}</pre>
      </div>
    </div>
  )
}
