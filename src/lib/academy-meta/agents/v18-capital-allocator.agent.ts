import { treasuryReinvestmentService } from '../services/treasury-reinvestment-service';
export class V18CapitalAllocatorAgent { async execute(ventureId: string) { return treasuryReinvestmentService.rebalanceVenture(ventureId); } }
export const v18CapitalAllocatorAgent = new V18CapitalAllocatorAgent();