import { AcademyLiveGovernanceTeamService } from "@/lib/academy/academy-live-governance-team.service";
import { TeacherResearchService } from "@/lib/academy/teacher-research.service";
import { SocialContentFactoryService } from "@/lib/content-factory/social-content-factory.service";
import { SocialEditorService } from "@/lib/production/social-editor.service";
import { AutoPosterService } from "@/lib/autopost/autoposter.service";
import { MemoryStoreService } from "@/lib/academy/memory-store.service";

async function main() {
  console.log("--- ACADEMY V2 LIVE FLOW VERIFICATION ---");
  
  const governance = new AcademyLiveGovernanceTeamService();
  const research = new TeacherResearchService();
  const factory = new SocialContentFactoryService();
  const editor = new SocialEditorService();
  const autoposter = new AutoPosterService();

  try {
    console.log("[1] Starting School Operations...");
    await governance.startSchool();
    console.log("School Live:", MemoryStoreService.getSchoolState().live);

    console.log("[2] Running Targeted Research (AI Category)...");
    const mem = await research.performResearch("teacher-001");
    console.log("Memory Created:", mem.title, "Score:", mem.prediction?.topicScore);

    console.log("[3] Simulating Content Draft...");
    const draft = await factory.buildFromCategory("ai");
    console.log("Draft Created:", draft.title, "Priority:", draft.prediction?.productionPriority);

    console.log("[4] Editorial Promotion...");
    await editor.editDraft(draft.id);
    const prod = await editor.sendToProduction(draft.id, "youtube");
    console.log("Production Item Queued:", prod.id, "Platform:", prod.platform);

    console.log("[5] Priority Queueing...");
    const queued = await autoposter.queueAllReady();
    console.log("Items Scheduled:", queued.length);

    console.log("[6] Final Stewardship Status...");
    const status = await governance.status();
    console.log("Active Governors:", status.governors.length);
    console.log("Memory Count:", status.school.live ? MemoryStoreService.getMemory().length : 0);

    console.log("\n[SUCCESS] OMEGA ACADEMY V2 LIVE FLOW VALIDATED.");
    process.exit(0);
  } catch (e) {
    console.error("\n[FAILURE] Drill failed:", e);
    process.exit(1);
  }
}

main();
