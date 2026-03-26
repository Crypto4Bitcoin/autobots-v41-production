export type DivisionDefinition = {
  slug: string;
  name: string;
  description: string;
  group: 'core' | 'science' | 'city' | 'content' | 'analysis' | 'operations';
  chartSymbol: string;
};

export const divisions: DivisionDefinition[] = [
  {
    slug: 'economy',
    name: 'Economy Brain',
    description: 'Market intelligence, synthetic indices, yearly metrics, and financial signal panels.',
    group: 'core',
    chartSymbol: 'AMEX:SPY',
  },
  {
    slug: 'power-grid',
    name: 'Power Grid Brain',
    description: 'Influence mapping for billionaire networks, institutions, and power overlap.',
    group: 'core',
    chartSymbol: 'NASDAQ:QQQ',
  },
  {
    slug: 'country-watch',
    name: 'Country Watch',
    description: 'Country profiles, stability scoring, macro trend views, and world fact layers.',
    group: 'core',
    chartSymbol: 'TVC:DXY',
  },
  {
    slug: 'conflict-watch',
    name: 'Conflict Watch',
    description: 'Conflict, sanctions, commodity stress, and public-signal escalation monitoring.',
    group: 'core',
    chartSymbol: 'TVC:USOIL',
  },
  {
    slug: 'life-systems',
    name: 'Life Systems',
    description: 'Population health, research trends, innovation tracking, and lab outputs.',
    group: 'science',
    chartSymbol: 'NASDAQ:MRNA',
  },
  {
    slug: 'us-signals',
    name: 'U.S. Public Signals',
    description: 'Elections, public officials, policy actions, and public communications.',
    group: 'analysis',
    chartSymbol: 'CBOE:TNX',
  },
  {
    slug: 'cognitive-systems',
    name: 'Cognitive Systems',
    description: 'Behavior-pattern scoring, stability metrics, and cognition-inspired signal panels.',
    group: 'analysis',
    chartSymbol: 'NASDAQ:META',
  },
  {
    slug: 'quantum-field',
    name: 'Quantum Field Brain',
    description: 'Quantum research, theory clusters, experiment timelines, and relay links.',
    group: 'science',
    chartSymbol: 'AMEX:XLK',
  },
  {
    slug: 'legacy-minds',
    name: 'Legacy Minds Research',
    description: 'Historical thinker research, source lineages, and idea-crosswalk dashboards.',
    group: 'science',
    chartSymbol: 'NASDAQ:GOOGL',
  },
  {
    slug: 'research-labs',
    name: 'Research Lab Exchange',
    description: 'Cross-division relay switchboard, shared learning lanes, and review queues.',
    group: 'science',
    chartSymbol: 'INDEX:IXIC',
  },
  {
    slug: 'loophole-detection',
    name: 'Loophole Detection',
    description: 'Integrity issues, drift checks, stale-data review, and simulation runs.',
    group: 'operations',
    chartSymbol: 'NYSE:IBM',
  },
  {
    slug: 'auto-x',
    name: 'Auto X Research Lab',
    description: 'Mission watch, launch archive, crew profiles, and public space monitoring.',
    group: 'science',
    chartSymbol: 'NYSE:LMT',
  },
  {
    slug: 'debate-core',
    name: 'Debate Core',
    description: 'Round view, flat view, fact-check view, and balanced argument breakdowns.',
    group: 'analysis',
    chartSymbol: 'NASDAQ:NFLX',
  },
  {
    slug: 'memetic-systems',
    name: 'Memetic Systems',
    description: 'Meme verification, archive, faceless page pipelines, and memetic performance.',
    group: 'content',
    chartSymbol: 'NASDAQ:PINS',
  },
  {
    slug: 'free-world-313',
    name: 'Free World 313',
    description: 'Detroit reality layer, district pages, venue concepts, and city-flow continuity.',
    group: 'city',
    chartSymbol: 'AMEX:DIA',
  },
  {
    slug: 'spectrum-brain',
    name: 'Spectrum Brain',
    description: 'Light, wavelength, frequency, energy, and color-reality panels.',
    group: 'science',
    chartSymbol: 'NASDAQ:NVDA',
  },
  {
    slug: 'wave-transmission-brain',
    name: 'Wave Transmission Brain',
    description: 'Radio waves, transmission chains, antennas, propagation, and signal integrity.',
    group: 'science',
    chartSymbol: 'NYSE:BA',
  },
  {
    slug: 'fossil-truth-brain',
    name: 'Fossil Truth Brain',
    description: 'Fossil evidence, revision tracking, confidence scoring, and paleontology truth filters.',
    group: 'science',
    chartSymbol: 'NYSE:MOS',
  },
  {
    slug: 'detroit-venue-layers',
    name: 'Detroit Venue Layers',
    description: 'Bowling, game halls, bars, debate lounges, ciphers, and district venue routing.',
    group: 'city',
    chartSymbol: 'NYSE:WY',
  },
];

export const divisionMap = new Map(divisions.map((division) => [division.slug, division] as const));
