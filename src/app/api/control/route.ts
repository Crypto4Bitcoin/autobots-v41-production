
import { NextResponse } from "next/server";
import { 
  GlobalRoutingIntelligence, 
  InterruptPriorityBus, 
  IntentRegistry, 
  UnifiedDecisionLedger,
  GoalConsistencyAnalyzer,
  TradeoffTransparencyEngine
} from "@/lib/services/control";

export async function GET() {
  const objectives = IntentRegistry.getObjectives();
  const decisions = UnifiedDecisionLedger.getRecords();
  return NextResponse.json({ objectives, decisions });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, payload } = body;

  let result: unknown = { status: "pending" };

  if (action === "route") {
    result = await GlobalRoutingIntelligence.selectOptimalRegion(payload);
    UnifiedDecisionLedger.log({
      source_layer: "control_plane",
      intent_alignment: 0.98,
      explanation: "Mission routed to optimal latency region.",
      status: "executed"
    });
  } else if (action === "interrupt") {
    result = await InterruptPriorityBus.publish(payload);
    UnifiedDecisionLedger.log({
      source_layer: "operator_sovereignty",
      intent_alignment: 1.0,
      explanation: "Priority interrupt broadcasted across system.",
      status: "executed"
    });
  } else if (action === "analyze") {
    const analysis = GoalConsistencyAnalyzer.analyze(payload);
    const explanation = TradeoffTransparencyEngine.explain(analysis);
    result = { analysis, explanation };
  }

  return NextResponse.json(result);
}
