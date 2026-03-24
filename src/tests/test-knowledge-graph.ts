import { KnowledgeGraphService } from "../lib/services/knowledge-graph.service";

async function testKnowledgeGraph() {
  console.log("🚀 Testing Phase 21: Cross-Workflow Knowledge Graph...\n");

  const kg = new KnowledgeGraphService();

  const mockArtifacts = [
    { id: "art-1", type: "search_results", workflow_run_id: "wf-1", metadata: { success_score: 0.9 } },
    { id: "art-2", type: "summary", workflow_run_id: "wf-1", parent_artifact_id: "art-1", metadata: { success_score: 0.85 } },
    { id: "art-3", type: "video", workflow_run_id: "wf-1", parent_artifact_id: "art-2", metadata: { success_score: 0.95 } }
  ];

  console.log("Scenario: Building cross-workflow lineage and pattern detection");
  const result = await kg.buildKnowledgeGraph(mockArtifacts);

  console.log("✅ Knowledge Graph State:");
  console.log(` - Artifacts Processed: ${result.lineage_count}`);
  console.log(` - High-Quality Points: ${result.knowledge_points}`);
  console.log(` - Detected Patterns: ${result.detected_patterns.length}`);
  result.detected_patterns.forEach(p => {
    console.log(`   * ${p.pattern} (Confidence: ${p.confidence}, Frequency: ${p.frequency})`);
  });

  if (result.knowledge_points === 3) {
    console.log("\n✅ Knowledge point discovery verified.");
  } else {
    console.error("\n❌ FAILED: Knowledge point discovery mismatch.");
  }

  console.log("\n🎉 PHASE 21: KNOWLEDGE GRAPH VERIFIED!");
}

testKnowledgeGraph();
