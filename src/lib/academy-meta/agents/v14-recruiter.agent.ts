import { workforceHiringService } from '../services/workforce-hiring-service';

export class V14RecruiterAgent {
  async execute(payload: unknown) {
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    return workforceHiringService.recruit(payload as any);
  }
}

export const v14RecruiterAgent = new V14RecruiterAgent();
