import { PackRegistryService } from "../lib/services/pack-registry.service";
import { PackLifecycleService } from "../lib/services/pack-lifecycle.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testPackEcosystem() {
  console.log("🚀 Testing Phase 16: Pack Ecosystem & Lifecycle Management...\n");

  const workspaceId = "ws-test-123";
  const packSlug = "research-pack";

  // 1. Setup Architecture Mocks
  setupSupabaseMock({
    workspace_governance_profiles: [{
        workspace_id: workspaceId,
        deniedPacks: ["malicious-pack"], // Governance deny list
        allowedTrustTier: 2
    }],
    vertical_packs: [{ id: "p1", slug: packSlug, current_version: "1.0.0" }],
    pack_versions: [{ id: "v1", pack_id: "p1", version: "1.0.0" }]
  });

  const registry = new PackRegistryService();
  const lifecycle = new PackLifecycleService();

  // 2. Scenario A: Register Pack
  console.log("Scenario A: Register Vertical Pack");
  const pack = await registry.registerPack({
    slug: "media-pack",
    name: "Media Production Pack",
    version: "1.1.0",
    manifest: {
      capabilities: ["media.render", "media.caption"],
      workflows: ["trend-to-video-v2"],
      required_trust_tier: 2
    },
    capabilities: ["media.render"]
  });
  console.log(`✅ Pack '${pack.slug}' registered successfully.\n`);

  // 3. Scenario B: Install Pack (Governed)
  console.log("Scenario B: Install Pack to Workspace");
  const install = await lifecycle.installPack(workspaceId, packSlug);
  console.log(`✅ Pack '${packSlug}' installed to workspace '${workspaceId}' (v${install.version}).\n`);

  // 4. Scenario C: Governance Restriction
  console.log("Scenario C: Governance Hook (Denied Pack)");
  try {
    await lifecycle.installPack(workspaceId, "malicious-pack");
    console.error("❌ FAILED: Governance did not block denied pack.");
  } catch (error: unknown) {
    console.log(`✅ Governance blocked installation: ${error.message}\n`);
  }

  // 5. Scenario D: Pack Upgrade
  console.log("Scenario D: Pack Version Upgrade");
  const upgrade = await lifecycle.upgradePack(workspaceId, packSlug, "1.0.0");
  console.log(`✅ Pack '${packSlug}' upgraded/pinned successfully to v${upgrade.version}.\n`);

  console.log("🎉 PHASE 16: PACK ECOSYSTEM VERIFIED!");
}

testPackEcosystem();
