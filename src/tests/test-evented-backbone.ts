import { DBService, supabase } from "../lib/services/supabase-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WorkflowEngine } from "../lib/services/workflow-engine";
import { PipelineStateService } from "../lib/services/pipeline-state-service";
import { PipelineState } from "../lib/types/enums";

async function testEventedBackbone() {
  console.log("🚀 Running Phase 8: Evented Backbone & Projection Verification...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";
  const pipelineItemId = "00000000-0000-0000-0000-111111111111";

  // 1. MOCK Setup for Eventing
  const events: unknown[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (supabase as any).from = (table: string) => ({
    insert: (rows: unknown[]) => {
        if (table === 'pipeline_events') events.push(...rows);
        return { select: () => ({ single: () => ({ data: rows[0] }) }) };
    },
    update: (fields: unknown) => ({
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// eslint-disable-next-line @typescript-eslint/no-unused-vars
        eq: (col: string, val: unknown) => ({ select: () => ({ single: () => ({ data: fields }) }) })
    })
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).getPipelineItem = async () => ({
    id: pipelineItemId,
    current_state: PipelineState.TREND_ANALYSIS, // Corrected from TREND_DISCOVERY
    metadata: {},
    title: "Test Item",
    last_artifact_id: null
  });

  try {
    console.log("Test: Triggering State Update (TREND_ANALYSIS -> ANGLE_GENERATION)...");
    
    // This should trigger an event in the mock
    await PipelineStateService.transitionState(
        pipelineItemId, 
        workspaceId, 
        PipelineState.ANGLE_GENERATION,
        { reason: "Trend identified" }
    );

    console.log(`✅ Passed: Event count: ${events.length}`);
    const lastEvent = events[events.length - 1];
    console.log(`   Event Type: ${lastEvent.event_type}`);
    console.log(`   Transition: ${lastEvent.from_state} -> ${lastEvent.to_state}`);

    if (lastEvent.to_state === PipelineState.ANGLE_GENERATION) {
        console.log("\n🎉 EVENTED BACKBONE PROPAGATION VERIFIED!");
    } else {
        throw new Error("State mismatch in event log.");
    }

  } catch (err) {
    console.error("\n❌ TESTS FAILED:");
    console.error(err);
    process.exit(1);
  }
}

// Set dummy envs
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dummy.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy";

testEventedBackbone();
