export default function AcademyV7Validation({ rows }: { rows: unknown[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <h2 className="mb-4 text-xl font-semibold">Validation Snapshot</h2>
      <div className="overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-neutral-400">
              <th className="p-2">Title</th>
              <th className="p-2">Demand</th>
              <th className="p-2">Competition</th>
              <th className="p-2">Conversion</th>
              <th className="p-2">Monetization</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10">
                <td className="p-2">{row.title}</td>
                <td className="p-2">{row.validation.searchDemand.toFixed(2)}</td>
                <td className="p-2">{row.validation.competitionPressure.toFixed(2)}</td>
                <td className="p-2">{row.validation.conversionLikelihood.toFixed(2)}</td>
                <td className="p-2">{row.validation.monetizationRealism.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
