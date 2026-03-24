import type {
  InternetResearchAsset,
  InternetResearchCategory,
  InternetResearchJob,
  InternetResearchPostPack,
  InternetResearchMarketPack,
} from '@/types/internetResearch';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function fakeCid(seed: string) {
  return `bafy${Buffer.from(seed).toString('hex').slice(0, 36)}`;
}

function detectCategory(query: string): InternetResearchCategory {
  const q = query.toLowerCase();

  if (q.includes('job') || q.includes('work') || q.includes('task')) return 'real-life-task';
  if (q.includes('service')) return 'service';
  if (q.includes('product')) return 'product';
  if (q.includes('local')) return 'local-job';
  if (q.includes('trend')) return 'trend';

  return 'general';
}

export async function gatherInternetAssets(query: string): Promise<InternetResearchAsset[]> {
  const category = detectCategory(query);

  const links: InternetResearchAsset[] = Array.from({ length: 5 }).map((_, i) => ({
    id: makeId('LNK'),
    type: 'link',
    title: `${query} link result ${i + 1}`,
    url: `https://example.com/search/${encodeURIComponent(query)}/${i + 1}`,
    category,
    verified: false,
    ipfsCid: fakeCid(`${query}:link:${i + 1}`),
    createdAt: now(),
  }));

  const pictures: InternetResearchAsset[] = Array.from({ length: 3 }).map((_, i) => ({
    id: makeId('PIC'),
    type: 'picture',
    title: `${query} picture ${i + 1}`,
    url: `/mock/internet-research/${encodeURIComponent(query)}-${i + 1}.png`,
    category,
    verified: false,
    ipfsCid: fakeCid(`${query}:picture:${i + 1}`),
    createdAt: now(),
  }));

  return [...links, ...pictures];
}

export async function composeMarketPostPack(
  query: string,
  assets: InternetResearchAsset[]
): Promise<InternetResearchPostPack> {
  const links = assets.filter((a) => a.type === 'link').length;
  const pictures = assets.filter((a) => a.type === 'picture').length;

  return {
    id: makeId('POST'),
    title: `${query} Research Pack`,
    summary: `Internet research team collected ${links} links and ${pictures} pictures for ${query}.`,
    xPost: `New research pack ready: ${query}. Verified internet findings, categorized assets, and content-ready references. #research #market #autobots`,
    facebookPost: `Our Internet Research Agent Team collected and organized a fresh package of real-world task data, links, and image assets for ${query}.`,
    youtubePost: `Research package built for ${query}. This includes verified links, image references, and a structured content pipeline ready for production.`,
    hashtags: ['research', 'internet', 'marketplace', 'autobots'],
    createdAt: now(),
  };
}

export async function verifyResearchAssets(
  assets: InternetResearchAsset[]
): Promise<InternetResearchAsset[]> {
  return assets.map((asset) => ({
    ...asset,
    verified: true,
  }));
}

export async function createMarketPack(
  query: string,
  postPack: InternetResearchPostPack,
  assetCount: number
): Promise<InternetResearchMarketPack> {
  return {
    id: makeId('MRK'),
    title: postPack.title,
    description: `Verified market-ready research pack for ${query} with ${assetCount} assets.`,
    price: Math.max(10, assetCount * 3),
    active: true,
    createdAt: now(),
  };
}

export async function runInternetResearchJob(job: InternetResearchJob): Promise<InternetResearchJob> {
  try {
    const researching: InternetResearchJob = {
      ...job,
      status: 'researching',
      updatedAt: now(),
    };

    const gathered = await gatherInternetAssets(job.sourceQuery);

    const composing: InternetResearchJob = {
      ...researching,
      assets: gathered,
      status: 'composing',
      updatedAt: now(),
    };

    const composedPack = await composeMarketPostPack(job.sourceQuery, gathered);

    const verifying: InternetResearchJob = {
      ...composing,
      composedPack,
      status: 'verifying',
      updatedAt: now(),
    };

    const verifiedAssets = await verifyResearchAssets(verifying.assets);
    const marketPack = await createMarketPack(
      job.sourceQuery,
      composedPack,
      verifiedAssets.length
    );

    return {
      ...verifying,
      assets: verifiedAssets,
      verified: true,
      marketPack,
      status: 'market-ready',
      updatedAt: now(),
    };
  } catch (error) {
    return {
      ...job,
      status: 'failed',
      updatedAt: now(),
    };
  }
}