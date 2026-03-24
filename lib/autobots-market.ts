type StorageBin = 'WAITING' | 'LIVE' | 'FORSALE' | 'LOCKDOWN' | 'ARCHIVE';

type AssetKind =
  | 'car'
  | 'art'
  | 'product'
  | 'service'
  | 'bundle'
  | 'profile'
  | 'real_upload';

type AssetCreatorType = 'agent_team' | 'real_user' | 'system';

type ReleaseMode = 'single' | 'all' | 'scheduled' | 'F4L';

type MoneyType = 'USD' | 'CREDITS';

type MarketAsset = {
  id: string;
  title: string;
  description: string;
  kind: AssetKind;
  creatorType: AssetCreatorType;
  creatorId: string;
  teamId: string | null;
  cid: string;
  previewImageCid: string | null;
  storageBin: StorageBin;
  tags: string[];
  liveVisible: boolean;
  createdAt: string;
  updatedAt: string;
};

type ForSaleListing = {
  id: string;
  assetId: string;
  sellerAgentId: string | null;
  marketerAgentId: string | null;
  title: string;
  price: number;
  moneyType: MoneyType;
  active: boolean;
  sold: boolean;
  featured: boolean;
  storageBin: StorageBin;
  createdAt: string;
  updatedAt: string;
};

type AutoposterControl = {
  id: string;
  mode: ReleaseMode;
  enabled: boolean;
  releaseEveryMinutes: number | null;
  releaseOneAtATime: boolean;
  freeForLife: boolean;
  lastReleasedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type AgentMarketJob = {
  id: string;
  agentId: string;
  role: 'autoposter' | 'forsale' | 'marketer' | 'artist' | 'vehicle-builder' | 'uploader';
  active: boolean;
  assignedAssetIds: string[];
  createdAt: string;
  updatedAt: string;
};

const assets = new Map<string, MarketAsset>();
const listings = new Map<string, ForSaleListing>();
const marketJobs = new Map<string, AgentMarketJob>();
const autoposterStore = new Map<string, AutoposterControl>();

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function fakeCid(seed: string) {
  return `bafy${Buffer.from(seed).toString('hex').slice(0, 36)}`;
}

function ensureAutoposter() {
  if (autoposterStore.size > 0) return;

  const control: AutoposterControl = {
    id: 'AUTOPOSTER-CORE',
    mode: 'single',
    enabled: true,
    releaseEveryMinutes: 1,
    releaseOneAtATime: true,
    freeForLife: false,
    lastReleasedAt: null,
    createdAt: now(),
    updatedAt: now(),
  };

  autoposterStore.set(control.id, control);

  const autoposterJob: AgentMarketJob = {
    id: makeId('JOB'),
    agentId: 'AG-AUTOPOSTER-001',
    role: 'autoposter',
    active: true,
    assignedAssetIds: [],
    createdAt: now(),
    updatedAt: now(),
  };

  marketJobs.set(autoposterJob.id, autoposterJob);
}

export function getAutoposterControl() {
  ensureAutoposter();
  return Array.from(autoposterStore.values())[0];
}

export function updateAutoposterControl(input: {
  mode: ReleaseMode;
  enabled?: boolean;
  releaseEveryMinutes?: number | null;
}) {
  ensureAutoposter();

  const control = Array.from(autoposterStore.values())[0];

  control.mode = input.mode;
  control.enabled = input.enabled ?? control.enabled;
  control.releaseEveryMinutes =
    input.mode === 'scheduled' || input.mode === 'single'
      ? (input.releaseEveryMinutes ?? control.releaseEveryMinutes ?? 1)
      : null;
  control.releaseOneAtATime = input.mode === 'single';
  control.freeForLife = input.mode === 'F4L';
  control.updatedAt = now();

  autoposterStore.set(control.id, control);
  return control;
}

export function registerMarketAgent(params: {
  agentId: string;
  role: AgentMarketJob['role'];
}) {
  const job: AgentMarketJob = {
    id: makeId('JOB'),
    agentId: params.agentId,
    role: params.role,
    active: true,
    assignedAssetIds: [],
    createdAt: now(),
    updatedAt: now(),
  };

  marketJobs.set(job.id, job);
  return job;
}

export function createMarketAsset(params: {
  title: string;
  description: string;
  kind: AssetKind;
  creatorType: AssetCreatorType;
  creatorId: string;
  teamId?: string | null;
  sourceSeed?: string;
  previewImageSeed?: string | null;
  tags?: string[];
  storageBin?: StorageBin;
  liveVisible?: boolean;
}) {
  const cid = fakeCid(
    `${params.sourceSeed ?? params.title}:${params.creatorId}:${params.kind}:${now()}`
  );

  const previewImageCid = params.previewImageSeed
    ? fakeCid(`${params.previewImageSeed}:${params.creatorId}:${now()}`)
    : null;

  const asset: MarketAsset = {
    id: makeId('AST'),
    title: params.title,
    description: params.description,
    kind: params.kind,
    creatorType: params.creatorType,
    creatorId: params.creatorId,
    teamId: params.teamId ?? null,
    cid,
    previewImageCid,
    storageBin: params.storageBin ?? 'WAITING',
    tags: params.tags ?? [],
    liveVisible: params.liveVisible ?? false,
    createdAt: now(),
    updatedAt: now(),
  };

  assets.set(asset.id, asset);
  return asset;
}

export function createAgentArtProduct(params: {
  teamId: string;
  title: string;
  description: string;
  marketerAgentId?: string | null;
  sellerAgentId?: string | null;
  price: number;
}) {
  const asset = createMarketAsset({
    title: params.title,
    description: params.description,
    kind: 'art',
    creatorType: 'agent_team',
    creatorId: params.teamId,
    teamId: params.teamId,
    sourceSeed: `${params.teamId}:${params.title}:art`,
    previewImageSeed: `${params.teamId}:${params.title}:preview`,
    tags: ['art', 'agent-made', 'market'],
    storageBin: 'FORSALE',
    liveVisible: false,
  });

  const listing = createForSaleListing({
    assetId: asset.id,
    title: asset.title,
    sellerAgentId: params.sellerAgentId ?? null,
    marketerAgentId: params.marketerAgentId ?? null,
    price: params.price,
    moneyType: 'USD',
    featured: false,
  });

  return { asset, listing };
}

export function createVehiclePlaceholder(params: {
  creatorId: string;
  title: string;
  description: string;
}) {
  return createMarketAsset({
    title: params.title,
    description: params.description,
    kind: 'car',
    creatorType: 'agent_team',
    creatorId: params.creatorId,
    teamId: params.creatorId,
    sourceSeed: `vehicle:${params.title}`,
    previewImageSeed: `vehicle-image:${params.title}`,
    tags: ['car', 'vehicle', 'placeholder'],
    storageBin: 'WAITING',
    liveVisible: false,
  });
}

export function createRealWorldUpload(params: {
  userId: string;
  title: string;
  description: string;
  kind?: AssetKind;
}) {
  return createMarketAsset({
    title: params.title,
    description: params.description,
    kind: params.kind ?? 'real_upload',
    creatorType: 'real_user',
    creatorId: params.userId,
    sourceSeed: `${params.userId}:${params.title}:real-upload`,
    previewImageSeed: `${params.userId}:${params.title}:preview`,
    tags: ['real-user', 'upload', 'forsale'],
    storageBin: 'WAITING',
    liveVisible: false,
  });
}

export function moveAssetToBin(assetId: string, storageBin: StorageBin, liveVisible?: boolean) {
  const asset = assets.get(assetId);
  if (!asset) return null;

  asset.storageBin = storageBin;
  asset.liveVisible = liveVisible ?? asset.liveVisible;
  asset.updatedAt = now();

  assets.set(asset.id, asset);
  return asset;
}

export function createForSaleListing(params: {
  assetId: string;
  title: string;
  sellerAgentId?: string | null;
  marketerAgentId?: string | null;
  price: number;
  moneyType: MoneyType;
  featured?: boolean;
}) {
  const asset = assets.get(params.assetId);
  if (!asset) return null;

  asset.storageBin = 'FORSALE';
  asset.updatedAt = now();
  assets.set(asset.id, asset);

  const listing: ForSaleListing = {
    id: makeId('LST'),
    assetId: params.assetId,
    sellerAgentId: params.sellerAgentId ?? null,
    marketerAgentId: params.marketerAgentId ?? null,
    title: params.title,
    price: params.price,
    moneyType: params.moneyType,
    active: true,
    sold: false,
    featured: params.featured ?? false,
    storageBin: 'FORSALE',
    createdAt: now(),
    updatedAt: now(),
  };

  listings.set(listing.id, listing);
  return listing;
}

export function autoposterReleaseNext() {
  ensureAutoposter();
  const control = getAutoposterControl();

  if (!control.enabled) {
    return { released: [], control };
  }

  const waitingAssets = Array.from(assets.values()).filter(
    (asset) => asset.storageBin === 'WAITING'
  );

  if (waitingAssets.length === 0) {
    return { released: [], control };
  }

  const toRelease =
    control.mode === 'all' || control.mode === 'F4L'
      ? waitingAssets
      : [waitingAssets[0]];

  const released = toRelease.map((asset) => {
    asset.storageBin = 'LIVE';
    asset.liveVisible = true;
    asset.updatedAt = now();
    assets.set(asset.id, asset);
    return asset;
  });

  control.lastReleasedAt = now();
  control.updatedAt = now();
  autoposterStore.set(control.id, control);

  return { released, control };
}

export function autoposterPromoteForSale(assetId: string) {
  const asset = assets.get(assetId);
  if (!asset) return null;

  asset.storageBin = 'FORSALE';
  asset.liveVisible = true;
  asset.updatedAt = now();
  assets.set(asset.id, asset);

  return asset;
}

export function getMarketSnapshot() {
  ensureAutoposter();

  const assetList = Array.from(assets.values()).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );
  const listingList = Array.from(listings.values()).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );
  const jobs = Array.from(marketJobs.values()).sort((a, b) =>
    a.updatedAt < b.updatedAt ? 1 : -1
  );

  const bins = {
    WAITING: assetList.filter((x) => x.storageBin === 'WAITING').length,
    LIVE: assetList.filter((x) => x.storageBin === 'LIVE').length,
    FORSALE: assetList.filter((x) => x.storageBin === 'FORSALE').length,
    LOCKDOWN: assetList.filter((x) => x.storageBin === 'LOCKDOWN').length,
    ARCHIVE: assetList.filter((x) => x.storageBin === 'ARCHIVE').length,
  };

  return {
    autoposter: getAutoposterControl(),
    bins,
    assets: assetList,
    listings: listingList,
    jobs,
  };
}
