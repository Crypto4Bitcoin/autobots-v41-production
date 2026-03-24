import { getMarketSnapshot } from '@/lib/autobots-market';

export default function MarketPage() {
  const snapshot = getMarketSnapshot();

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-4xl font-bold">AutoBots Marketstore</h1>
          <p className="text-zinc-400">
            IPFS-backed live market with Autoposter release control, for-sale bins,
            agent-made art, vehicle placeholders, and real-world uploads.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card title="WAITING" value={String(snapshot.bins.WAITING)} />
          <Card title="LIVE" value={String(snapshot.bins.LIVE)} />
          <Card title="FORSALE" value={String(snapshot.bins.FORSALE)} />
          <Card title="LOCKDOWN" value={String(snapshot.bins.LOCKDOWN)} />
          <Card title="ARCHIVE" value={String(snapshot.bins.ARCHIVE)} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card title="Autoposter Mode" value={snapshot.autoposter.mode} />
          <Card title="Enabled" value={String(snapshot.autoposter.enabled)} />
          <Card
            title="Release Every"
            value={
              snapshot.autoposter.releaseEveryMinutes
                ? `${snapshot.autoposter.releaseEveryMinutes} min`
                : 'n/a'
            }
          />
          <Card title="F4L" value={String(snapshot.autoposter.freeForLife)} />
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">Live Assets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshot.assets.length === 0 ? (
              <p className="text-zinc-400">No market assets yet.</p>
            ) : (
              snapshot.assets.map((asset) => (
                <div key={asset.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">{asset.title}</h3>
                      <p className="text-zinc-400">{asset.description}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-sm">
                      {asset.storageBin}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <Mini label="Asset ID" value={asset.id} />
                    <Mini label="Kind" value={asset.kind} />
                    <Mini label="Creator" value={asset.creatorId} />
                    <Mini label="Visible" value={String(asset.liveVisible)} />
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-zinc-500">CID</p>
                    <p className="text-xs text-zinc-300 break-all">{asset.cid}</p>
                  </div>

                  {asset.previewImageCid && (
                    <div className="mt-3">
                      <p className="text-xs text-zinc-500">Preview CID</p>
                      <p className="text-xs text-zinc-300 break-all">{asset.previewImageCid}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">For Sale Listings</h2>
          <div className="space-y-4">
            {snapshot.listings.length === 0 ? (
              <p className="text-zinc-400">No listings yet.</p>
            ) : (
              snapshot.listings.map((listing) => (
                <div key={listing.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="flex flex-col md:flex-row md:justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold">{listing.title}</h3>
                      <p className="text-zinc-400">Asset: {listing.assetId}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-sm w-fit">
                      {listing.price} {listing.moneyType}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 text-sm">
                    <Mini label="Listing ID" value={listing.id} />
                    <Mini label="Seller" value={listing.sellerAgentId || 'n/a'} />
                    <Mini label="Marketer" value={listing.marketerAgentId || 'n/a'} />
                    <Mini label="Active" value={String(listing.active)} />
                    <Mini label="Sold" value={String(listing.sold)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold mb-4">Market Jobs</h2>
          <div className="space-y-4">
            {snapshot.jobs.length === 0 ? (
              <p className="text-zinc-400">No market jobs yet.</p>
            ) : (
              snapshot.jobs.map((job) => (
                <div key={job.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                    <Mini label="Job ID" value={job.id} />
                    <Mini label="Agent ID" value={job.agentId} />
                    <Mini label="Role" value={job.role} />
                    <Mini label="Active" value={String(job.active)} />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900">
      <h2 className="font-semibold text-lg">{title}</h2>
      <p className="text-zinc-300 break-all">{value}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-900 p-3">
      <p className="text-zinc-500">{label}</p>
      <p className="break-all">{value}</p>
    </div>
  );
}
