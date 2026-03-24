export type ResearchMode =
  | 'e2e'
  | 'control-screen';

export type DecisionMode =
  | 'RED'
  | 'BLUE';

export type ResearchDepartmentStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'error';

export type ResearchSourceType =
  | 'youtube'
  | 'webpage'
  | 'x'
  | 'facebook'
  | 'search'
  | 'unknown';

export type ScreenshotCategory =
  | 'cover'
  | 'detail'
  | 'action';

export type SocialTarget =
  | 'youtube'
  | 'x'
  | 'facebook';

export interface ResearchLinkInput {
  id: string;
  url: string;
  sourceType: ResearchSourceType;
  createdAt: string;
}

export interface ResearchScreenshot {
  id: string;
  imageUrl: string;
  category: ScreenshotCategory;
  localPath: string | null;
  ipfsCid: string | null;
  createdAt: string;
}

export interface ResearchSummaryPack {
  id: string;
  title: string;
  shortSummary: string;
  youtubePost: string;
  xPost: string;
  facebookPost: string;
  hashtags: string[];
  createdAt: string;
}

export interface ResearchJob {
  id: string;
  inputId: string;
  mode: ResearchMode;
  decisionMode: DecisionMode;
  status: 'queued' | 'processing' | 'done' | 'failed';
  sourceType: ResearchSourceType;
  screenshots: ResearchScreenshot[];
  summaryPack: ResearchSummaryPack | null;
  publishedTargets: SocialTarget[];
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchDepartmentState {
  departmentId: string;
  decisionMode: DecisionMode;
  automaticDecisionEnabled: boolean;
  selectedMode: ResearchMode;
  status: ResearchDepartmentStatus;
  currentInputUrl: string;
  agentFrontName: string;
  inputs: ResearchLinkInput[];
  jobs: ResearchJob[];
  lastRunAt: string | null;
}

const type_stub = (props: any) => null;
export default type_stub;
