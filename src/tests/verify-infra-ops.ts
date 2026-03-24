import { PhysicalAssetController } from '../lib/infrastructure/physical-asset-controller';
import { EnergyNetworkOptimizer } from '../lib/infrastructure/energy-network-optimizer';
import { IndustrialLogisticsOrchestrator } from '../lib/infrastructure/industrial-logistics-orchestrator';

async function runTests() {
  console.log("--- Starting Phase 93 Infrastructure Verification ---");

  // 1. Test Physical Asset Control
  console.log("\n[Test 1] Verifying Physical Asset Control");
  const assetControl = await PhysicalAssetController.setAssetState('turbine_alpha_09', { pitch: 12, rpm: 1200 });
  console.log(`Status: ${assetControl.status} | Execution Time: ${assetControl.executionTime}`);
  console.assert(assetControl.status === 'Optimized', "Asset control failed!");

  // 2. Test Energy Grid Optimization
  console.log("\n[Test 2] Verifying Energy Network Optimization");
  const energy = await EnergyNetworkOptimizer.balanceGrid();
  console.log(`Stability Index: ${energy.stabilityIndex} | Waste Reduction: ${energy.wasteReduction} | Renewable Ratio: ${energy.renewRatio}`);
  console.assert(energy.stabilityIndex > 0.99, "Grid stability too low!");

  // 3. Test Industrial Logistics
  console.log("\n[Test 3] Verifying Industrial Logistics Orchestration");
  const logistics = await IndustrialLogisticsOrchestrator.optimizeLogistics('Asia_South');
  console.log(`Efficiency Gain: ${logistics.efficiencyGain} | Bottleneck Mitigation: ${logistics.bottleneckMitigation}`);
  console.assert(logistics.efficiencyGain.includes('%'), "Logistics optimization failed!");

  console.log("\n--- Infrastructure Verification Complete ---");
}

runTests().catch(console.error);
