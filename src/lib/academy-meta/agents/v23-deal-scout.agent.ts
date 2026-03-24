import { dealFlowService } from '../services/deal-flow-service';

export class V23DealScoutAgent {
  async execute(input: {
    ventureId: string;
    type: 'sponsorship' | 'partnership' | 'affiliate' | 'b2b';
    counterparty: string;
    status: 'lead' | 'qualified' | 'proposal_sent' | 'won' | 'lost';
    valueCents: number;
    notes: string;
  }) {
    return dealFlowService.createDeal(input);
  }
}

export const v23DealScoutAgent = new V23DealScoutAgent();
