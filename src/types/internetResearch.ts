export type InternetResearchJobStatus =
  | 'idle'
  | 'queued'
  | 'researching'
  | 'composing'
  | 'verifying'
  | 'market-ready'
  | 'failed';

export type InternetResearchCategory =
  | 'real-life-task'
  | 'service'
  | 'product'
  | 'trend'
  | 'local-job'
  | 'general';

export interface InternetResearchAsset {
  id: string;
  type: 'link' | 'picture';
  title: string;
  url: string;
  category: InternetResearchCategory;
  verified: boolean;
  ipfsCid: string | null;
  createdAt: string;
}

export interface InternetResearchBrain {
  id: string;
  teamId: string;
  maxAssets: number;
  storedAssets: number;
  storagePercent: number;
  valueScore: number;
  linksStored: number;
  picturesStored: number;
  locked: boolean;
}

export interface InternetResearchPostPack {
  id: string;
  title: string;
  summary: string;
  xPost: string;
  facebookPost: string;
  youtubePost: string;
  hashtags: string[];
  createdAt: string;
}

export interface InternetResearchMarketPack {
  id: string;
  title: string;
  description: string;
  price: number;
  active: boolean;
  createdAt: string;
}

export interface InternetResearchJob {
  id: string;
  sourceQuery: string;
  status: InternetResearchJobStatus;
  assets: InternetResearchAsset[];
  composedPack: InternetResearchPostPack | null;
  verified: boolean;
  marketPack: InternetResearchMarketPack | null;
  createdAt: string;
  updatedAt: string;
}

export interface InternetResearchTeamState {
  teamId: string;
  teamName: string;
  enabled: boolean;
  currentQuery: string;
  jobs: InternetResearchJob[];
  brain: InternetResearchBrain;
  lastRunAt: string | null;
}