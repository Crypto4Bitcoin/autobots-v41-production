export default function AcademyV7Summary({ data }: { data: unknown }) {
  const cards = [
    { label: "Archive Count", value: data.count },
    { label: "Ready", value: data.readyForMarketplace },
    { label: "Validated", value: data.validated },
    { label: "Rejected", value: data.rejected },
  ]

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-400">{card.label}</div>
          <div className="mt-2 text-2xl font-semibold">{card.value}</div>
        </div>
      ))}
    </section>
  )
}
