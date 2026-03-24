import { EvolutionAgent } from "../../../../lib/agents/evolution-agent";
import { TwinEvolutionSandbox } from "../../../../lib/services/twin-evolution-sandbox.service";
import { TwinOutcomeForecaster } from "../../../../lib/services/twin-outcome-forecaster.service";
import { RealitySyncGovernor } from "../../../../lib/services/reality-sync-governor.service";
import { GoalConsistencyAnalyzer } from "../../../../lib/services/goal-consistency-analyzer.service";
import { TradeoffTransparencyEngine } from "../../../../lib/services/tradeoff-transparency-engine.service";
import { OptimizationDriftDetector } from "../../../../lib/services/optimization-drift-detector.service";
import { ContinuousStrategicRehearsal } from "../../../../lib/services/strategic-rehearsal.service";
import { HumanLegibilityEngine } from "../../../../lib/services/human-legibility-engine.service";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  try {
    const cycle_id = `EVO-${Date.now()}`;

    // 0. Truth Sync Guard
    const truthCheck = await RealitySyncGovernor.checkEvolutionSafety();
    if (!truthCheck.allowed) {
        return NextResponse.json({ 
            cycle_id, 
            status: "blocked", 
            reason: "TRUTH_DRIFT", 
            detail: truthCheck.reason,
            legibility: "Evolution gated: Model-Reality divergence detected."
        });
    }

    // 1. Proposal
    const mutation = await EvolutionAgent.analyzeArchitecture();
    if (!mutation) return NextResponse.json({ status: "idle" });

    // 2. Background Rehearsal
    const backgroundDrill = await ContinuousStrategicRehearsal.triggerUnsolicitedRehearsal();

    // 3. Simulation & Long-Horizon Forecasting
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const rehearsal = await TwinEvolutionSandbox.rehearseMutation(mutation);
    const deepForecast = await TwinOutcomeForecaster.deepSimulate(mutation, 15);
    
    // 4. Strategic Intent Alignment
    const alignment = await GoalConsistencyAnalyzer.analyzeAlignment(mutation, deepForecast);
    const explanation = TradeoffTransparencyEngine.explainDecision(alignment);
    
    const driftAudit = OptimizationDriftDetector.detectSilentDrift([]);

    if (!alignment.aligned) {
        return NextResponse.json({ 
            cycle_id, 
            status: "blocked", 
            reason: "STRATEGIC_MISALIGNMENT", 
            explanation,
            alignment_scores: alignment.scores,
            suggestion: "Re-align mutation with high-level mission goals like Sovereignty or Legibility."
        });
    }

    // 5. Final Promotion
    return NextResponse.json({
      cycle_id,
      mutation_promoted: mutation.proposed_change,
      governance: "STRATEGIC_INTENT_VERIFIED",
      explanation,
      rehearsal_drill: backgroundDrill.type,
      forecast: deepForecast,
      drift_audit: driftAudit,
      legibility: await HumanLegibilityEngine.explainMutation(mutation, { status: "promoted" })
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
