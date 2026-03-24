export default function QueuePanels({
  memoryCount,
  socialDraftCount,
  socialEditedCount,
  productionQueuedCount,
  productionScheduledCount,
  productionPostedCount,
  productionFailedCount,
}: {
  memoryCount: number
  socialDraftCount: number
  socialEditedCount: number
  productionQueuedCount: number
  productionScheduledCount: number
  productionPostedCount: number
  productionFailedCount: number
}) {
  const cards = [
    { label: "Memory Records", value: memoryCount, color: "text-cyan-400" },
    { label: "Social Drafts", value: socialDraftCount, color: "text-violet-400" },
    { label: "Edited Social", value: socialEditedCount, color: "text-purple-400" },
    { label: "Queued", value: productionQueuedCount, color: "text-blue-400" },
    { label: "Scheduled", value: productionScheduledCount, color: "text-emerald-400" },
    { label: "Posted", value: productionPostedCount, color: "text-green-400" },
    { label: "Failed", value: productionFailedCount, color: "text-red-400" },
  ]

  return (
    <section className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7 text-white">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-white/10 bg-neutral-900 p-4 transition-all hover:border-white/20 hover:scale-105">
          <div className="text-[10px] uppercase tracking-[0.1em] text-neutral-500 font-bold">{card.label}</div>
          <div className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</div>
        </div>
      ))}
    </section>
  )
}
