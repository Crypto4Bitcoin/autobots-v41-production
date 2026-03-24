export default function AcademyV7Pipeline({ rows }: { rows: unknown[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <h2 className="mb-4 text-xl font-semibold">Prototype Pipeline</h2>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Build Days</th>
              <th className="p-2">Final Score</th>
              <th className="p-2">Stage</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10">
                <td className="p-2">{row.title}</td>
                <td className="p-2">{row.category}</td>
                <td className="p-2">{row.plan.estimatedBuildDays}</td>
                <td className="p-2">{row.score.finalScore.toFixed(2)}</td>
                <td className="p-2">{row.score.stage}</td>
                <td className="p-2">{row.governedAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
