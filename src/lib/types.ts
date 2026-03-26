export type VerifierState = 'verified' | 'provisional' | 'synthetic';
export type Direction = 'up' | 'down' | 'flat';

export type SeriesPoint = {
  year: string;
  value: number;
};

export type MetricCardData = {
  title: string;
  value: string;
  delta: string;
  direction: Direction;
  verifier: VerifierState;
  series: SeriesPoint[];
};

export type WatchItem = {
  id?: string;
  name: string;
  category: string;
  score: number;
  change: number;
  verifier: VerifierState;
};

export type EventItem = {
  id?: string;
  date: string;
  title: string;
  type: string;
  impact: string;
  source: string;
};

export type RelayItem = {
  id?: string;
  from: string;
  to: string;
  lane: string;
  status: 'live' | 'queued' | 'review' | 'approved' | 'rejected';
  payload: string;
};

export type IssueItem = {
  id: string;
  type: 'conflict' | 'edge_case' | 'drift' | 'stale' | 'relay' | 'verifier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedModules: string[];
  status: 'open' | 'watching' | 'resolved';
};

export type ScenarioItem = {
  id?: string;
  name: string;
  outcome: string;
  result: 'pass' | 'warn' | 'fail';
  note: string;
};

export type DivisionEntity = {
  id: string;
  name: string;
  entityType: string;
  status: 'active' | 'draft' | 'archived';
  description: string;
};

export type SourceRecord = {
  id: string;
  label: string;
  sourceType: string;
  referenceUrl?: string;
  sourceCount: number;
  confidenceScore: number;
  verifiedAt?: string;
};

export type ActionIntent =
  | 'refresh-signals'
  | 'run-verifier'
  | 'run-simulation'
  | 'approve-relay'
  | 'reject-relay'
  | 'resolve-issue'
  | 'create-entity'
  | 'log-event'
  | 'seed-database';

export type DashboardFilters = {
  q?: string;
  status?: string;
  verifier?: string;
};

export type DashboardPayload = {
  slug: string;
  title: string;
  summary: string;
  chartSymbol: string;
  metrics: MetricCardData[];
  watchlist: WatchItem[];
  events: EventItem[];
  relay?: RelayItem[];
  issues?: IssueItem[];
  scenarios?: ScenarioItem[];
  entities?: DivisionEntity[];
  sources?: SourceRecord[];
  gridLabel?: string;
  architectureNote?: string;
  filters?: DashboardFilters;
  dataMode?: 'mock' | 'database';
};
