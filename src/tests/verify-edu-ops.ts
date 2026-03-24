import { AdaptiveLearningSystem } from '../lib/edu/adaptive-learning.system';
import { SkillPathwayGenerator } from '../lib/edu/skill-pathway-generator';
import { KnowledgeDistributionNetwork } from '../lib/edu/knowledge-distribution-network';
import { SkillBaseline } from '../lib/edu/skill-baseline';

async function runTests() {
  console.log("--- Starting Phase 96 Education Verification ---");

  // 1. Test Skill Baseline
  console.log("\n[Test 1] Verifying Skill Baseline");
  const baseline = SkillBaseline.getBaseline();
  console.log(`Global Competency: ${baseline.globalCompetency} | Efficiency: ${baseline.distributionEfficiency}`);
  console.assert(baseline.globalCompetency > 0.7, "Global competency too low!");

  // 2. Test Adaptive Learning
  console.log("\n[Test 2] Verifying Adaptive Learning System");
  const learning = await AdaptiveLearningSystem.deliverContent('learner_77', 'Quantum_Computing');
  console.log(`Module: ${learning.module} | Mastery Gain: ${learning.estimatedMasteryGain}`);
  console.assert(learning.module.includes('Quantum'), "Content delivery failed!");

  // 3. Test Pathway Generation
  console.log("\n[Test 3] Verifying Skill Pathway Generator");
  const pathway = await SkillPathwayGenerator.generatePathway('Graphene_v2');
  console.log(`Pathway: ${pathway.title} | Steps: ${pathway.steps.length}`);
  console.assert(pathway.steps.length > 0, "Pathway generation failed!");

  // 4. Test Knowledge Distribution
  console.log("\n[Test 4] Verifying Knowledge Distribution Network");
  const distribution = await KnowledgeDistributionNetwork.broadcastKnowledge('Quantum_Logic');
  console.log(`Coverage: ${distribution.coverage} | Nodes Updated: ${distribution.nodesUpdated}`);
  console.assert(distribution.nodesUpdated > 0, "Knowledge distribution failed!");

  console.log("\n--- Education Verification Complete ---");
}

runTests().catch(console.error);
