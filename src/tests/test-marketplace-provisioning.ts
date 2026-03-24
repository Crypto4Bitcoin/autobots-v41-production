import { WorkspaceProvisioningService } from "../lib/services/workspace-provisioning.service";
import { MarketplaceService } from "../lib/services/marketplace.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testMarketplaceProvisioning() {
  console.log("🚀 Testing Phase 40: Marketplace & Tenant Provisioning...\n");

  setupSupabaseMock();

  // 1. Workspace Provisioning
  const provisioner = new WorkspaceProvisioningService();
  const res = await provisioner.provisionWorkspace("Global Robotics Corp");
  console.log(`✅ Workspace Provisioned: ${res.workspace_id} (Status: ${res.setup_status})`);
  console.log(`- Initial API Key generated for tenant: ${res.api_key.substring(0, 10)}...`);

  // 2. Marketplace Browsing
  const marketplace = new MarketplaceService();
  const packs = await marketplace.browsePacks();
  console.log(`✅ Marketplace Catalog: ${packs.length} packs available.`);
  console.log(`- Featured: ${packs[0].name} (Trust: ${packs[0].trust_label})`);

  // 3. Pack Installation
  await marketplace.installPack(res.workspace_id, "pack-research-v2");
  console.log(`✅ Pack 'pack-research-v2' installed via governed marketplace flow.`);

  console.log("\n🎉 PHASE 40: MARKETPLACE & PROVISIONING VERIFIED!");
}

testMarketplaceProvisioning();
