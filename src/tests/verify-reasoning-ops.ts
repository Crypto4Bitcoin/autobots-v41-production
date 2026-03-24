import { CivilizationRelationGraph } from '../lib/civic/civilization-relation-graph';
import { DomainReasoningEngine } from '../lib/civic/domain-reasoning.engine';
import { CrossDomainInsightService } from '../lib/civic/cross-domain-insight.service';
import { KnowledgeOntology } from '../lib/civic/knowledge-ontology';

async function runTests() {
  console.log("--- Starting Phase 92 Reasoning Verification ---");

  // 1. Test Entity Linking
  console.log("\n[Test 1] Verifying Civilization Relation Graph");
  const link = await CivilizationRelationGraph.linkEntities('Graphene_v2', 'Energy_Grids', 'Efficiency_Upgrade');
  console.log(`Link Status: ${link.status} | Relation ID: ${link.relationId}`);
  console.assert(link.status === 'Linked', "Entity linking failed!");

  // 2. Test Domain Reasoning
  console.log("\n[Test 2] Verifying Domain Reasoning Engine");
  const inference = await DomainReasoningEngine.inferImplications('Graphene_v2', 'Energy');
  console.log(`Inference Certainty: ${inference.certainty} | Implication: ${inference.primaryImplication}`);
  console.assert(inference.certainty > 0.8, "Reasoning certainty too low!");

  // 3. Test World Insight Synthesis
  console.log("\n[Test 3] Verifying Cross-Domain Insight Service");
  const discovery = await CrossDomainInsightService.generateWorldInsight();
  console.log(`World Trend: ${discovery.trend} | Risk Clusters: ${discovery.riskClusters.join(', ')}`);
  console.assert(discovery.trend.includes('Convergent'), "Insight generation failed!");

  // 4. Test Ontology Retrieval
  console.log("\n[Test 4] Verifying Knowledge Ontology");
  const ontology = KnowledgeOntology.getOntologyDefinition();
  console.log(`Concepts: ${ontology.concepts.join(', ')} | Facets: ${ontology.facets.join(', ')}`);
  console.assert(ontology.concepts.length > 0, "Ontology empty!");

  console.log("\n--- Reasoning Verification Complete ---");
}

runTests().catch(console.error);
