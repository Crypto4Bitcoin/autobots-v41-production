import { PlanetaryLoadBalancer } from '../lib/optimization/planetary-load-balancer';
import { EnergyAwareScheduler } from '../lib/optimization/energy-aware-scheduler';
import { SupplyChainOrchestrator } from '../lib/optimization/supply-chain-orchestrator';
import { ScarcityMitigationService } from '../lib/optimization/scarcity-mitigation.service';

async function runTests() {
  console.log("--- Starting Phase 82 Resource Optimization Verification ---");

  // 1. Test Global Load Balancing
  console.log("\n[Test 1] Verifying Global Load Balancing");
  const balancerResult = await PlanetaryLoadBalancer.rebalanceGlobalLoad();
  console.log(`Balancer Status: ${balancerResult.status} | Rebalanced Tasks: ${balancerResult.movedTaskCount}`);
  console.assert(balancerResult.status === 'Optimal', "Global rebalancing failed!");

  // 2. Test Energy-Aware Routing
  console.log("\n[Test 2] Verifying Energy-Aware Routing");
  const targetRegion = EnergyAwareScheduler.routeByGreenMetric('complex_model_training_01');
  console.log(`Selected Green Region: ${targetRegion}`);
  console.assert(['eu-central', 'ap-south'].includes(targetRegion), "Should have selected a green region!");

  // 3. Test Supply Chain Tracking
  console.log("\n[Test 3] Verifying Supply Chain Orchestration");
  const shipment = await SupplyChainOrchestrator.trackShipment('ship_planetary_delta_1');
  console.log(`Shipment Location: ${shipment.location} | ETA: ${shipment.eta}`);
  console.assert(shipment.status === 'In_Transit', "Shipment tracking failed!");

  // 4. Test Scarcity Mitigation
  console.log("\n[Test 4] Verifying Scarcity Mitigation");
  await ScarcityMitigationService.activateMitigation('NVIDIA_H100_FLUX');

  console.log("\n--- Resource Optimization Verification Complete ---");
}

runTests().catch(console.error);
