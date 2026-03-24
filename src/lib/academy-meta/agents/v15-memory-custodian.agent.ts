import { companyMemoryService } from '../services/company-memory-service';
import { ResearchKnowledge } from '../types';
export class V15MemoryCustodianAgent { async execute(ventureId: string, knowledge: ResearchKnowledge) { return companyMemoryService.copyTeacherKnowledgeToVenture({ ventureId, knowledge }); } }
export const v15MemoryCustodianAgent = new V15MemoryCustodianAgent();