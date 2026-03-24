import { socialSchedulerService } from '../services/social-scheduler-service';
export class V16SocialDirectorAgent { async execute(ventureId: string, productId: string) { return socialSchedulerService.scheduleProductCampaign(ventureId, productId); } }
export const v16SocialDirectorAgent = new V16SocialDirectorAgent();