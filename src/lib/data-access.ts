import { dashboards } from '@/lib/mock-data';
import { hasDatabaseEnv } from '@/lib/env';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type {
  DashboardPayload,
  DashboardFilters,
  EventItem,
  RelayItem,
  IssueItem,
  ScenarioItem,
  WatchItem,
  MetricCardData,
  DivisionEntity,
  SourceRecord,
} from '@/lib/types';
import { divisionMap } from '@/lib/divisions';

export type DashboardRepository = {
  getDashboard(slug: string, filters?: DashboardFilters): Promise<DashboardPayload | null>;
};

function applyFilters<T extends { name?: string; title?: string; status?: string; verifier?: string }>(
  rows: T[],
  filters?: DashboardFilters
) {
  if (!filters) return rows;
  return rows.filter((row) => {
    const searchable = `${row.name ?? ''} ${row.title ?? ''}`.toLowerCase();
    const queryOk = !filters.q || searchable.includes(filters.q.toLowerCase());
    const statusOk = !filters.status || row.status === filters.status;
    const verifierOk = !filters.verifier || row.verifier === filters.verifier;
    return queryOk && statusOk && verifierOk;
  });
}

function getMockDashboard(slug: string, filters?: DashboardFilters): DashboardPayload | null {
  const base = dashboards[slug];
  if (!base) return null;

  return {
    ...base,
    filters,
    watchlist: applyFilters(base.watchlist, filters),
    events: applyFilters(base.events, filters),
    relay: applyFilters(base.relay ?? [], filters),
    issues: applyFilters(base.issues ?? [], filters),
    entities: applyFilters(base.entities ?? [], filters),
    dataMode: 'mock',
  };
}

async function getDatabaseDashboard(slug: string, filters?: DashboardFilters): Promise<DashboardPayload | null> {
  const definition = divisionMap.get(slug);
  if (!definition) return null;

  const client = getSupabaseServerClient();
  if (!client) {
    return getMockDashboard(slug, filters);
  }

  const [divisionResult, metricsResult, watchResult, eventsResult, relayResult, issuesResult, scenariosResult, entitiesResult, sourcesResult] =
    await Promise.all([
      client.from('divisions').select('*').eq('slug', slug).maybeSingle(),
      client.from('metric_cards_view').select('*').eq('division_slug', slug).order('sort_order'),
      client.from('watch_scores_view').select('*').eq('division_slug', slug).order('score', { ascending: false }),
      client.from('events_view').select('*').eq('division_slug', slug).order('event_date', { ascending: false }).limit(50),
      client.from('relay_links_view').select('*').or(`from_division_slug.eq.${slug},to_division_slug.eq.${slug}`).limit(50),
      client.from('integrity_issues_view').select('*').eq('division_slug', slug).order('created_at', { ascending: false }).limit(50),
      client.from('simulation_runs_view').select('*').eq('division_slug', slug).order('created_at', { ascending: false }).limit(50),
      client.from('entities_view').select('*').eq('division_slug', slug).order('name'),
      client.from('source_records_view').select('*').eq('division_slug', slug).order('confidence_score', { ascending: false }),
    ]);

  const metricRows = (metricsResult.data ?? []) as any[];
  const watchRows = (watchResult.data ?? []) as any[];
  const eventRows = (eventsResult.data ?? []) as any[];
  const relayRows = (relayResult.data ?? []) as any[];
  const issueRows = (issuesResult.data ?? []) as any[];
  const scenarioRows = (scenariosResult.data ?? []) as any[];
  const entityRows = (entitiesResult.data ?? []) as any[];
  const sourceRows = (sourcesResult.data ?? []) as any[];

  const payload: DashboardPayload = {
    slug,
    title: divisionResult.data?.name ?? definition.name,
    summary: divisionResult.data?.description ?? definition.description,
    chartSymbol: definition.chartSymbol,
    gridLabel: divisionResult.data?.grid_signature ?? '9x9x9 lock',
    architectureNote: divisionResult.data?.architecture_note ?? 'Loaded from database.',
    dataMode: 'database',
    filters,
    metrics: metricRows.length
      ? metricRows.map(
          (row): MetricCardData => ({
            title: row.title,
            value: row.value_display,
            delta: row.delta_display,
            direction: row.direction,
            verifier: row.verifier_state,
            series: row.series_points ?? [],
          })
        )
      : getMockDashboard(slug)?.metrics ?? [],
    watchlist: applyFilters(
      watchRows.map(
        (row): WatchItem => ({
          id: row.id,
          name: row.name,
          category: row.category,
          score: row.score,
          change: row.change_value,
          verifier: row.verifier_state,
        })
      ),
      filters
    ),
    events: applyFilters(
      eventRows.map(
        (row): EventItem => ({
          id: row.id,
          date: row.event_date,
          title: row.title,
          type: row.event_type,
          impact: row.impact_level,
          source: row.source_label,
        })
      ),
      filters
    ),
    relay: applyFilters(
      relayRows.map(
        (row): RelayItem => ({
          id: row.id,
          from: row.from_division_name,
          to: row.to_division_name,
          lane: row.relay_lane,
          status: row.status,
          payload: row.payload_summary,
        })
      ),
      filters
    ),
    issues: applyFilters(
      issueRows.map(
        (row): IssueItem => ({
          id: row.id,
          type: row.issue_type,
          severity: row.severity,
          description: row.description,
          affectedModules: row.affected_modules ?? [],
          status: row.status,
        })
      ),
      filters
    ),
    scenarios: scenarioRows.map(
      (row): ScenarioItem => ({
        id: row.id,
        name: row.name,
        outcome: row.outcome,
        result: row.result,
        note: row.note,
      })
    ),
    entities: applyFilters(
      entityRows.map(
        (row): DivisionEntity => ({
          id: row.id,
          name: row.name,
          entityType: row.entity_type,
          status: row.status,
          description: row.description,
        })
      ),
      filters
    ),
    sources: sourceRows.map(
      (row): SourceRecord => ({
        id: row.id,
        label: row.label,
        sourceType: row.source_type,
        referenceUrl: row.reference_url,
        sourceCount: row.source_count,
        confidenceScore: row.confidence_score,
        verifiedAt: row.verified_at,
      })
    ),
  };

  return payload;
}

export const dashboardRepository: DashboardRepository = {
  async getDashboard(slug, filters) {
    if (!divisionMap.has(slug)) return null;
    if (!hasDatabaseEnv()) return getMockDashboard(slug, filters);
    return getDatabaseDashboard(slug, filters);
  },
};
