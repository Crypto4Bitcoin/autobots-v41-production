export default function AcademyV7Archive({ rows }: { rows: unknown[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-neutral-900 p-4">
      <h2 className="mb-4 text-xl font-semibold">Archive</h2>
      <pre className="overflow-auto text-xs text-neutral-300">{JSON.stringify(rows, null, 2)}</pre>
    </section>
  )
}
