import { Orchestrator } from "./orchestrator";
import { PipelineState } from "../types/enums";
import { IntakeAgent } from "@/agents/ingestion/intake-agent";
import { ClassifyAgent } from "@/agents/ingestion/classify-agent";
import { ResearchAgent } from "@/agents/knowledge/research-agent";
import { FactCheckAgent } from "@/agents/knowledge/fact-check-agent";
import { TrendDiscoveryAgent } from "@/agents/knowledge/trend-discovery-agent";
import { AngleAgent } from "@/agents/strategy/angle-agent";
import { PersonaAgent } from "@/agents/strategy/persona-agent";
import { StrategyAgent } from "@/agents/strategy/strategy-agent";
import { CompositionAgent } from "@/agents/production/composition-agent";
import { RepurposingAgent } from "@/agents/production/repurposing-agent";
import { AssetBriefAgent } from "@/agents/production/asset-brief-agent";
import { QualityScorerAgent } from "@/agents/scoring/quality-scorer-agent";
import { ViralityScorerAgent } from "@/agents/scoring/virality-scorer-agent";
import { ComplianceAgent } from "@/agents/review/compliance-agent";
import { PlatformReviewAgent } from "@/agents/review/platform-review-agent";
import { ExpansionAgent } from "@/agents/intelligence/expansion-agent";
import { MemoryUpdateAgent } from "@/agents/intelligence/memory-update-agent";
import { AnalyticsAgent } from "@/agents/intelligence/analytics-agent";

export function initializeAgentRegistry() {
  // Ingestion
  Orchestrator.registerAgent(PipelineState.INPUT_RECEIVED, new IntakeAgent());
  Orchestrator.registerAgent(PipelineState.CLASSIFYING_INPUT, new ClassifyAgent());
  
  // Knowledge
  Orchestrator.registerAgent(PipelineState.RESEARCHING, new ResearchAgent());
  Orchestrator.registerAgent(PipelineState.FACT_CHECKING, new FactCheckAgent());
  Orchestrator.registerAgent(PipelineState.TREND_ANALYSIS, new TrendDiscoveryAgent());
  
  // Strategy
  Orchestrator.registerAgent(PipelineState.ANGLE_GENERATION, new AngleAgent());
  Orchestrator.registerAgent(PipelineState.PERSONA_MODELING, new PersonaAgent());
  Orchestrator.registerAgent(PipelineState.CONTENT_STRATEGY, new StrategyAgent());
  
  // Production
  Orchestrator.registerAgent(PipelineState.CONTENT_COMPOSITION, new CompositionAgent());
  Orchestrator.registerAgent(PipelineState.REPURPOSING, new RepurposingAgent());
  Orchestrator.registerAgent(PipelineState.ASSET_BRIEFING, new AssetBriefAgent());
  
  // QC & Review
  Orchestrator.registerAgent(PipelineState.QUALITY_SCORING, new QualityScorerAgent());
  Orchestrator.registerAgent(PipelineState.VIRALITY_SCORING, new ViralityScorerAgent());
  Orchestrator.registerAgent(PipelineState.COMPLIANCE_CHECK, new ComplianceAgent());
  Orchestrator.registerAgent(PipelineState.PLATFORM_REVIEW, new PlatformReviewAgent());

  // Intelligence
  Orchestrator.registerAgent(PipelineState.EXPANSION, new ExpansionAgent());
  Orchestrator.registerAgent(PipelineState.MEMORY_UPDATE, new MemoryUpdateAgent());
  Orchestrator.registerAgent(PipelineState.ANALYTICS, new AnalyticsAgent());
}
