import { audienceSovereigntyService } from '../services/audience-sovereignty-service';

export class V21AudienceChancellorAgent {
  async ingestMember(input: {
    ventureId: string;
    handle?: string;
    email?: string;
    phone?: string;
    tags: string[];
    consent: boolean;
    trustScore: number;
    sourcePlatform?: 'facebook' | 'instagram' | 'x' | 'threads' | 'linkedin' | 'youtube' | 'tiktok' | 'blog';
  }) {
    return audienceSovereigntyService.ingestAudienceMember(input);
  }

  async buildSegment(input: { ventureId: string; name: string; rule: string; requiredTag: string }) {
    return audienceSovereigntyService.buildSegment(input);
  }
}

export const v21AudienceChancellorAgent = new V21AudienceChancellorAgent();
