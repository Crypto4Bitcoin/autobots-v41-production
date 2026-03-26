import { divisions } from '@/lib/divisions';
import type {
  DashboardPayload,
  EventItem,
  IssueItem,
  RelayItem,
  ScenarioItem,
  SourceRecord,
  WatchItem,
  DivisionEntity,
  VerifierState,
} from '@/lib/types';

const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
const mkSeries = (base: number, drift: number) =>
  years.map((year, index) => ({
    year,
    value: Number((base + index * drift + (index % 2 === 0 ? 1.4 : -0.8)).toFixed(1)),
  }));

const verifierCycle: VerifierState[] = ['verified', 'provisional', 'synthetic'];

const relay: RelayItem[] = [
  { id: 'relay_1', from: 'Quantum Field Brain', to: 'Economy Brain', lane: 'materials / energy hypotheses', status: 'review', payload: 'theory cluster -> impact screening' },
  { id: 'relay_2', from: 'Legacy Minds Research', to: 'Quantum Field Brain', lane: 'historical notes / idea lineage', status: 'live', payload: 'archived concepts -> modern paper mapping' },
  { id: 'relay_3', from: 'Life Systems', to: 'Research Lab Exchange', lane: 'signal methods', status: 'queued', payload: 'measurement models -> cross-lab scoring' },
  { id: 'relay_4', from: 'Conflict Watch', to: 'Country Watch', lane: 'global pressure markers', status: 'approved', payload: 'event feed -> country stress weighting' },
  { id: 'relay_5', from: 'Auto X Research Lab', to: 'Research Lab Exchange', lane: 'mission telemetry methods', status: 'review', payload: 'observation workflows -> shared anomaly rules' },
];

const integrityIssues: IssueItem[] = [
  { id: 'issue_1', type: 'stale', severity: 'medium', description: 'Country stress feed aged past refresh window during replay.', affectedModules: ['country-watch', 'relay-engine'], status: 'watching' },
  { id: 'issue_2', type: 'relay', severity: 'high', description: 'Cross-lab relay duplicated one historical note into two queues.', affectedModules: ['research-labs', 'legacy-minds'], status: 'open' },
  { id: 'issue_3', type: 'verifier', severity: 'low', description: 'One provisional metric entered dashboard without source-count annotation.', affectedModules: ['metric-shell', 'verifier-badge'], status: 'resolved' },
];

const simulationDeck: ScenarioItem[] = [
  { id: 'scenario_1', name: 'Stale feed replay', outcome: 'Downgraded confidence and blocked score refresh', result: 'pass', note: 'Freshness monitor caught the replay before render.' },
  { id: 'scenario_2', name: 'Contradicting relay payload', outcome: 'Raised manual review ticket', result: 'warn', note: 'Payload mismatch detected but still awaiting human resolution.' },
  { id: 'scenario_3', name: 'Metric drift injection', outcome: 'Integrity score fell below threshold and card was tagged provisional', result: 'pass', note: 'Drift detector worked exactly as intended.' },
  { id: 'scenario_4', name: 'Missing source count', outcome: 'Badge fell back to synthetic', result: 'fail', note: 'UI protected the card, but logging still needs a hard fail-closed path.' },
];

function mkWatch(seed: string): WatchItem[] {
  return [
    { name: `${seed} Primary Lane`, category: 'Primary', score: 78, change: 3.1, verifier: 'verified' },
    { name: `${seed} Research Lane`, category: 'Research', score: 71, change: 1.4, verifier: 'provisional' },
    { name: `${seed} Relay Lane`, category: 'Relay', score: 66, change: -0.5, verifier: 'synthetic' },
  ];
}

function mkEvents(seed: string): EventItem[] {
  return [
    { id: `${seed}_event_1`, date: '2026-03-04', title: `${seed} baseline sync`, type: 'Sync', impact: 'Low', source: 'Public source index' },
    { id: `${seed}_event_2`, date: '2026-03-15', title: `${seed} signal refresh`, type: 'Signals', impact: 'Medium', source: 'Verifier queue' },
    { id: `${seed}_event_3`, date: '2026-03-24', title: `${seed} relay update`, type: 'Relay', impact: 'Low', source: 'Internal exchange' },
  ];
}

function mkEntities(seed: string): DivisionEntity[] {
  return [
    { id: `${seed}_entity_1`, name: `${seed} Prime`, entityType: 'theme', status: 'active', description: `Primary tracked entity for ${seed}.` },
    { id: `${seed}_entity_2`, name: `${seed} Support`, entityType: 'lab', status: 'draft', description: `Secondary research lane for ${seed}.` },
  ];
}

function mkSources(seed: string): SourceRecord[] {
  return [
    { id: `${seed}_source_1`, label: `${seed} public source`, sourceType: 'public', sourceCount: 4, confidenceScore: 84, verifiedAt: '2026-03-24T14:00:00Z' },
    { id: `${seed}_source_2`, label: `${seed} relay note`, sourceType: 'internal', sourceCount: 2, confidenceScore: 61, verifiedAt: '2026-03-23T11:20:00Z' },
  ];
}

function mkPayload(index: number, slug: string, title: string, summary: string, chartSymbol: string): DashboardPayload {
  const seed = title.split(' ')[0];
  return {
    slug,
    title,
    summary,
    chartSymbol,
    gridLabel: '9x9x9 lock',
    architectureNote: '729-cell topology across front lane, back lane, verifier lane, relay lane, and archive lane.',
    dataMode: 'mock',
    metrics: [
      { title: 'Signal Strength', value: `${70 + index}.${index}`, delta: '+3.2%', direction: 'up', verifier: verifierCycle[index % 3], series: mkSeries(48 + index, 2.6) },
      { title: 'Integrity Rate', value: `${54 + index}.1`, delta: '+1.2%', direction: 'up', verifier: verifierCycle[(index + 1) % 3], series: mkSeries(39 + index, 1.4) },
      { title: 'Freshness Load', value: `${40 + index}.8`, delta: '-0.9%', direction: 'down', verifier: verifierCycle[(index + 2) % 3], series: mkSeries(50 - index, -0.6) },
      { title: 'Relay Yield', value: `${25 + index}.3`, delta: '+5.1%', direction: 'up', verifier: verifierCycle[index % 3], series: mkSeries(18 + index, 3.2) },
    ],
    watchlist: mkWatch(seed),
    events: mkEvents(seed),
    relay,
    issues: index % 2 === 0 ? integrityIssues : undefined,
    scenarios: index % 3 === 0 ? simulationDeck : undefined,
    entities: mkEntities(seed),
    sources: mkSources(seed),
  };
}

const summaries: Record<string, string> = {
  economy: 'Core financial truth layer with market panels, synthetic leader scores, yearly graph views on every measurable card, and the shared 9x9x9 lock structure.',
  'power-grid': 'Separate research lanes for billionaire networks, elite influence clusters, and institutional overlap mapping in the same 9x9x9 lock.',
  'country-watch': 'Country-level stability, growth, resource pressure, and yearly macro signals across separate panels with lab relays and verifier cells.',
  'conflict-watch': 'Conflict pressure, sanctions, resource stress, and market reaction lanes with public-signal event tracking.',
  'life-systems': 'Population-level health, research activity, innovation tracking, yearly graphs, and relay-ready lab outputs.',
  'us-signals': 'Election cycles, public officials, policy actions, and communication streams organized into clean separate lanes.',
  'cognitive-systems': 'Behavior-pattern scoring, stress indicators, coherence signals, and yearly graphs for system-level cognition models.',
  'quantum-field': 'Quantum physics research, field theory, experiment timelines, and measurement relay outputs.',
  'legacy-minds': 'Historical thinker research, idea lineages, notebooks, and modern relevance crosswalks.',
  'research-labs': 'Shared back-brain exchange where divisions pass findings, queue reviews, and strengthen the main branch.',
  'loophole-detection': 'System integrity, contradiction scans, stale-data review, scenario runs, and loophole hardening.',
  'auto-x': 'Launch watch, mission archive, crew profiles, aerospace research, and public space signals.',
  'debate-core': 'Round view, flat view, and fact-check view held together by balanced argument analysis.',
  'memetic-systems': 'Meme archive, verification, faceless page pipelines, and performance tracking.',
  'free-world-313': 'Detroit reality layer, district hubs, smooth city flow, and themed venue routing.',
  'spectrum-brain': 'Light, frequency, color, energy, and wavelength understanding with visual comparisons.',
  'wave-transmission-brain': 'Radio-wave transmission, antennas, propagation, receivers, and signal integrity.',
  'fossil-truth-brain': 'Dinosaur evidence, revision logs, confidence scoring, and false-claim separation.',
  'detroit-venue-layers': 'Bowling, bars, game stores, pool halls, ciphers, debate lounges, and district venue pages.',
};

export const dashboards: Record<string, DashboardPayload> = Object.fromEntries(
  divisions.map((division, index) => [
    division.slug,
    mkPayload(index + 1, division.slug, division.name, summaries[division.slug] ?? division.description, division.chartSymbol),
  ])
);
