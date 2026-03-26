import type { DashboardFilters } from '@/lib/types';

export function FilterBar({ slug, filters }: { slug: string; filters?: DashboardFilters }) {
  return (
    <form className="card filterBar" method="GET" action={`/${slug}`}>
      <div className="filterGroup">
        <label htmlFor="q">Search</label>
        <input id="q" name="q" defaultValue={filters?.q ?? ''} placeholder="search entities, events, issues" />
      </div>
      <div className="filterGroup">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" defaultValue={filters?.status ?? ''}>
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="watching">Watching</option>
          <option value="resolved">Resolved</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>
      <div className="filterGroup">
        <label htmlFor="verifier">Verifier</label>
        <select id="verifier" name="verifier" defaultValue={filters?.verifier ?? ''}>
          <option value="">All</option>
          <option value="verified">Verified</option>
          <option value="provisional">Provisional</option>
          <option value="synthetic">Synthetic</option>
        </select>
      </div>
      <div className="filterActions">
        <button className="button" type="submit">Apply filters</button>
      </div>
    </form>
  );
}
