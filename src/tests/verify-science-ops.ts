import { HypothesisGenerator } from '../lib/science/hypothesis-generator';
import { AutomatedExperimentLoop } from '../lib/science/automated-experiment-loop';
import { DiscoveryPublisher } from '../lib/science/discovery-publisher';
import { ResearchAgentPool } from '../lib/science/research-agent-pool';

async function runTests() {
  console.log("--- Starting Phase 91 Science Verification ---");

  // 1. Test Hypothesis Generation
  console.log("\n[Test 1] Verifying Hypothesis Generation");
  const hypotheses = await HypothesisGenerator.generateHypotheses('Environmental');
  console.log(`Generated ${hypotheses.length} hypotheses.`);
  console.assert(hypotheses.length > 0, "No hypotheses generated!");
  console.log(`Top Hypothesis: ${hypotheses[0].statement} (Confidence: ${hypotheses[0].confidence})`);

  // 2. Test Automated Experiment
  console.log("\n[Test 2] Verifying Automated Experiment Loop");
  const experiment = await AutomatedExperimentLoop.runExperiment(hypotheses[0].id);
  console.log(`Experiment Status: ${experiment.status} | Replication Confidence: ${experiment.replicationConfidence}`);
  console.assert(experiment.status === 'Validated', "Experiment failed validation!");

  // 3. Test Discovery Publication
  console.log("\n[Test 3] Verifying Discovery Publication");
  const publication = await DiscoveryPublisher.publishDiscovery(hypotheses[0]);
  console.log(`Publication ID: ${publication.publicationId} | Access: ${publication.accessLevel}`);
  console.assert(publication.publicationId.startsWith('DOI_'), "Publication failed!");

  // 4. Test Research Agent Allocation
  console.log("\n[Test 4] Verifying Research Agent Allocation");
  const allocation = await ResearchAgentPool.allocateAgents('Environmental', 10);
  console.log(`Active Agents: ${allocation.activeAgents} | Resources: ${allocation.computeReserved}`);
  console.assert(allocation.activeAgents === 10, "Agent allocation failed!");

  console.log("\n--- Science Verification Complete ---");
}

runTests().catch(console.error);
