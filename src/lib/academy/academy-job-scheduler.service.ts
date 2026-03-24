import { AcademyRegistryService } from "./academy-registry.service";
import { TeacherResearchService } from "./teacher-research.service";

export class AcademyJobScheduler {
  private static instance: AcademyJobScheduler;
  private timer: unknown = null;
  private isRunning = false;

  public static getInstance() {
    if (!this.instance) this.instance = new AcademyJobScheduler();
    return this.instance;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log("[Scheduler] Academy Background Worker Started.");
    
    this.timer = setInterval(async () => {
      console.log("[Scheduler] Triggering Hourly Rotation...");
      AcademyRegistryService.rotateTeachers(25);
      
      const researchers = ["teacher-001", "teacher-002", "teacher-003"];
      const service = new TeacherResearchService();
      for (const id of researchers) {
        console.log("[Scheduler] Background Research for " + id + "...");
        await service.performResearch(id).catch(console.error);
      }
    }, 10 * 60 * 1000); 
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.isRunning = false;
  }
}