import type {
  ResearchMode,
  ResearchSourceType,
  ResearchScreenshot,
  ResearchSummaryPack,
  ScreenshotCategory,
} from '@/types/research';

function now() {
  return new Date().toISOString();
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

function fakeCid(seed: string) {
  return `bafy${Buffer.from(seed).toString('hex').slice(0, 36)}`;
}

export function detectResearchSourceType(url: string): ResearchSourceType {
  const value = url.toLowerCase();

  if (value.includes('youtube.com') || value.includes('youtu.be')) return 'youtube';
  if (value.includes('x.com') || value.includes('twitter.com')) return 'x';
  if (value.includes('facebook.com')) return 'facebook';
  if (value.includes('google.com/search') || value.includes('/search?q=')) return 'search';
  if (value.startsWith('http://') || value.startsWith('https://')) return 'webpage';

  return 'unknown';
}

export function buildAutomaticSearchUrl(agentFrontName: string): string {
  const clean = agentFrontName.trim() || 'Agent';
  const q = encodeURIComponent(`${clean} AGENT research`);
  return `https://www.google.com/search?q=${q}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function captureThreeScreenshots(params: {
  url: string;
  mode: ResearchMode;
}): Promise<ResearchScreenshot[]> {
  const categories: ScreenshotCategory[] = ['cover', 'detail', 'action'];

  return categories.map((category, index) => ({
    id: makeId('SS'),
    imageUrl: `/mock/research/${category}-${index + 1}.png`,
    category,
    localPath: `/tmp/research/${category}-${index + 1}.png`,
    ipfsCid: null,
    createdAt: now(),
  }));
}

export async function uploadScreenshotsToIPFS(
  screenshots: ResearchScreenshot[],
  seed: string
): Promise<ResearchScreenshot[]> {
  return screenshots.map((shot, index) => ({
    ...shot,
    ipfsCid: fakeCid(`${seed}:${shot.category}:${index}`),
  }));
}

export async function buildSummaryPack(params: {
  url: string;
  sourceType: ResearchSourceType;
  screenshots: ResearchScreenshot[];
}): Promise<ResearchSummaryPack> {
  const baseTitle =
    params.sourceType === 'youtube'
      ? 'YouTube Research Summary'
      : params.sourceType === 'search'
      ? 'Automatic Search Research Summary'
      : 'Research Summary Pack';

  return {
    id: makeId('SUM'),
    title: baseTitle,
    shortSummary: `Research team processed ${params.url} and extracted 3 categorized screenshots for production workflow.`,
    youtubePost: `Research summary for ${params.url}\n\nWe analyzed the source, pulled 3 visual frames, categorized the content, and prepared the media package for production.`,
    xPost: `Research team processed a new source, captured 3 key frames, and built the media summary pack. #research #media #autobots`,
    facebookPost: `Our research department reviewed a new source, captured the most useful screenshots, and passed the package to the media team for publishing and repurposing.`,
    hashtags: ['research', 'media', 'autobots', 'ipfs'],
    createdAt: now(),
  };
}

export async function publishSummaryToTargets(params: {
  summary: ResearchSummaryPack;
  targets: Array<'youtube' | 'x' | 'facebook'>;
}): Promise<Array<'youtube' | 'x' | 'facebook'>> {
  return params.targets;
}

export class buildSummaryPackStub { static async execute() { return {}; } }

export class captureThreeScreenshotsStub { static async execute() { return {}; } }

export class publishSummaryToTargetsStub { static async execute() { return {}; } }

export class uploadScreenshotsToIPFSStub { static async execute() { return {}; } }
