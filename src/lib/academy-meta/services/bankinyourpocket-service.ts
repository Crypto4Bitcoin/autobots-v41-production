import { revenueAttributionService } from './revenue-attribution-service';
import { socialSchedulerService } from './social-scheduler-service';
import { treasuryReinvestmentService } from './treasury-reinvestmentService';

export class BankInYourPocketService {
  async runDailyCycle(input: {
    ventureId: string; productId: string;
    syntheticRevenue?: { contentId: string; platform: 'facebook' | 'instagram' | 'x' | 'threads' | 'linkedin' | 'youtube' | 'tiktok' | 'blog', views: number, clicks: number, conversions: number, revenueCents: number }[];
  }) {
    const scheduled = await socialSchedulerService.scheduleProductCampaign(input.ventureId, input.productId);
    if (input.syntheticRevenue?.length) {
      for (const event of input.syntheticRevenue) {
        await revenueAttributionService.recordRevenue({ ventureId: input.ventureId, ...event });
      }
    }
    const treasuryPlan = await treasuryReinvestmentService.rebalanceVenture(input.ventureId);
    return { scheduled, treasuryPlan };
  }
}
export const bankInYourPocketService = new BankInYourPocketService();
