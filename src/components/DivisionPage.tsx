import { TradingViewFrame } from '@/components/TradingViewFrame';
import { MetricCard } from '@/components/MetricCard';
import { YearlyBarPanel } from '@/components/YearlyBarPanel';
import { WatchlistTable } from '@/components/WatchlistTable';
import { EventTable } from '@/components/EventTable';
import { RelayTable } from '@/components/RelayTable';
import { IssueTable } from '@/components/IssueTable';
import { ScenarioTable } from '@/components/ScenarioTable';
import { FilterBar } from '@/components/FilterBar';
import { ActionBar } from '@/components/ActionBar';
import { EmptyState } from '@/components/EmptyState';
import { EntitiesTable } from '@/components/EntitiesTable';
import { SourceTable } from '@/components/SourceTable';
import type { DashboardPayload } from '@/lib/types';

export function DivisionPage({ dashboard }: { dashboard: DashboardPayload }) {
  const primaryMetric = dashboard.metrics[0];
  const secondaryMetric = dashboard.metrics[1] ?? dashboard.metrics[0];

  return (
    <div className="pageStack">
      <section className="heroCard">
        <div className="sectionHeader">
          <div>
            <p className="eyebrow">Division</p>
            <h1>{dashboard.title}</h1>
            <p className="lede">{dashboard.summary}</p>
          </div>
          <div className="tinyMeta">Mode: {dashboard.dataMode ?? 'mock'}</div>
        </div>
        {(dashboard.gridLabel || dashboard.architectureNote) && (
          <div className="pillRow">
            {dashboard.gridLabel ? <span className="pill">{dashboard.gridLabel}</span> : null}
            {dashboard.architectureNote ? <span className="pill">{dashboard.architectureNote}</span> : null}
          </div>
        )}
      </section>

      <FilterBar slug={dashboard.slug} filters={dashboard.filters} />
      <ActionBar slug={dashboard.slug} />

      <TradingViewFrame symbol={dashboard.chartSymbol} title={`${dashboard.title} market surface`} />

      <section className="grid fourCol">
        {dashboard.metrics.map((metric) => (
          <MetricCard key={metric.title} metric={metric} />
        ))}
      </section>

      {primaryMetric && secondaryMetric ? (
        <section className="grid twoCol">
          <YearlyBarPanel metric={primaryMetric} />
          <YearlyBarPanel metric={secondaryMetric} />
        </section>
      ) : (
        <EmptyState title="No metrics yet" copy="Seed or ingest metric rows to render yearly panels." />
      )}

      <section className="grid twoCol">
        <WatchlistTable items={dashboard.watchlist} title="Priority watchlist" />
        <EventTable items={dashboard.events} />
      </section>

      {dashboard.entities?.length ? <EntitiesTable items={dashboard.entities} /> : null}
      {dashboard.sources?.length ? <SourceTable items={dashboard.sources} /> : null}
      {dashboard.relay?.length ? <RelayTable items={dashboard.relay} /> : null}
      {dashboard.issues?.length ? <IssueTable items={dashboard.issues} /> : null}
      {dashboard.scenarios?.length ? <ScenarioTable items={dashboard.scenarios} /> : null}
    </div>
  );
}
