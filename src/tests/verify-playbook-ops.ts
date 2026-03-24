import { StrategicPlaybookRegistry } from '../lib/strategy/strategic-playbook.registry';
import { PlaybookExtractionService } from '../lib/strategy/playbook-extraction.service';
import { StrategicPatternDetector } from '../lib/strategy/strategic-pattern-detector';

async function runTests() {
  console.log("--- Starting Phase 75 Strategic Playbook Verification ---");

  const workspaceId = 'workspace_gamma';

  // 1. Test Pattern Detection
  console.log("\n[Test 1] Verifying Pattern Detection");
  const patterns = StrategicPatternDetector.detectPatterns(workspaceId);
  console.log(`Detected Patterns: ${patterns.join(', ')}`);
  console.assert(patterns.length > 0, "Should have detected recurring patterns!");

  // 2. Test Playbook Promotion
  console.log("\n[Test 2] Verifying Playbook Promotion");
  const pattern = "Competitor_Intelligence_Briefing";
  const workflow = ['Scrape Data', 'Extract Alpha', 'Generate PDF'];
  
  const initialCount = StrategicPlaybookRegistry.getPlaybooks().length;
  await PlaybookExtractionService.analyzeAndPromote(workspaceId, pattern, workflow);
  
  const finalCount = StrategicPlaybookRegistry.getPlaybooks().length;
  console.log(`Initial Count: ${initialCount} | Final Count: ${finalCount}`);
  console.assert(finalCount === initialCount + 1, "Playbook should have been promoted!");

  // 3. Test Retrieval
  console.log("\n[Test 3] Verifying Playbook Retrieval");
  const playbooks = StrategicPlaybookRegistry.getPlaybooks();
  const promoted = playbooks.find(pb => pb.name === pattern);
  console.log(`Retrieved Playbook: ${promoted?.name}`);
  console.assert(promoted?.workflow.length === 3, "Playbook workflow should match!");

  console.log("\n--- Strategic Playbook Verification Complete ---");
}

runTests().catch(console.error);
