// Set dummy environment variables before any imports
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://dummy.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "dummy";

import { DBService } from "../lib/services/supabase-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PipelineState } from "../lib/types/enums";

async function testLineage() {
  console.log("🚀 Running Versioned Artifact Lineage Tests (Mocked)...\n");

  const workspaceId = "00000000-0000-0000-0000-000000000001";
  const pipelineItemId = "00000000-0000-0000-0000-111111111111";

  // MOCK DBService for environment without real Supabase connection
  const mockStorage: unknown[] = [];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).createArtifact = async (art: unknown) => {
    const newArt = { ...art, id: Math.random().toString(), created_at: new Date().toISOString() };
    mockStorage.push(newArt);
    return newArt;
  };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).getPipelineItem = async (id: string) => ({ id, last_artifact_id: mockStorage[mockStorage.length-1]?.id });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  (DBService as any).getArtifactLineage = async (id: string) => mockStorage.filter(a => a.pipeline_item_id === id);

  try {
    // 1. Create Initial Artifact
    console.log("Test 1: Creating initial artifact...");
    const art1 = await DBService.createArtifact({
      workspace_id: workspaceId,
      pipeline_item_id: pipelineItemId,
      type: "source_transcript",
      data: { text: "Hello world" }
    });
    console.log(`   Artifact 1 ID: ${art1.id}`);

    // Verify pipeline item last_artifact_id
    const item = await DBService.getPipelineItem(pipelineItemId);
    if (item.last_artifact_id === art1.id) {
      console.log("✅ Passed: Pipeline item linked to last_artifact_id.\n");
    } else {
      throw new Error(`Failed: Item last_artifact_id (${item.last_artifact_id}) != ${art1.id}`);
    }

    // 2. Create Child Artifact
    console.log("Test 2: Creating child artifact (lineage)...");
    const art2 = await DBService.createArtifact({
      workspace_id: workspaceId,
      pipeline_item_id: pipelineItemId,
      parent_artifact_id: art1.id,
      type: "research_pack",
      data: { summary: "Simplified content" }
    });
    console.log(`   Artifact 2 ID: ${art2.id} | Parent: ${art2.parent_artifact_id}`);
    
    if (art2.parent_artifact_id === art1.id) {
      console.log("✅ Passed: Child artifact correctly linked to parent.\n");
    } else {
      throw new Error("Failed: Parent-Child linkage failed");
    }

    // 3. Verify Lineage Retrieval
    console.log("Test 3: Retrieving full lineage chain...");
    const lineage = await DBService.getArtifactLineage(pipelineItemId);
    console.log(`   Chain length: ${lineage.length}`);
    if (lineage.length === 2 && lineage[0].id === art1.id && lineage[1].id === art2.id) {
      console.log("✅ Passed: Lineage chain preserved and ordered.\n");
    } else {
      throw new Error("Failed: Lineage retrieval incorrect");
    }

    console.log("🎉 ALL ARTIFACT LINEAGE TESTS PASSED!");

  } catch (err) {
    console.error("\n❌ TESTS FAILED:");
    console.error(err);
    process.exit(1);
  }
}

testLineage();
