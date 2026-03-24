import { AudienceMember, AudienceSegment } from '../types';

export class AudienceStore {
  private members: AudienceMember[] = [];
  private segments: AudienceSegment[] = [];

  async createMember(member: AudienceMember) {
    this.members.push(member);
    return member;
  }

  async listMembers(ventureId: string) {
    return this.members.filter((m) => m.ventureId === ventureId);
  }

  async createSegment(segment: AudienceSegment) {
    this.segments.push(segment);
    return segment;
  }

  async listSegments(ventureId: string) {
    return this.segments.filter((s) => s.ventureId === ventureId);
  }
}

export const audienceStore = new AudienceStore();
