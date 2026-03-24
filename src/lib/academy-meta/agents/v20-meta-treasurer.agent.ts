import { bankInYourPocketService } from '../services/bankinyourpocket-service';
export class V20MetaTreasurerAgent { async execute(input: unknown) { return bankInYourPocketService.runDailyCycle(input); } }
export const v20MetaTreasurerAgent = new V20MetaTreasurerAgent();