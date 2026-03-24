import cron, { ScheduledTask } from "node-cron"
import { PrincipalRotationService } from "@/lib/academy/principal-rotation.service"
import { TeacherResearchService } from "@/lib/academy/teacher-research.service"
import { AcademyRegistryService } from "@/lib/academy/academy-registry.service"
import { SocialContentFactoryService } from "@/lib/content-factory/social-content-factory.service"
import { SocialEditorService } from "@/lib/production/social-editor.service"
import { AutoPosterService } from "@/lib/autopost/autoposter.service"
import { VerifyAgentService } from "@/lib/academy/verify-agent.service"

export class AcademySchedulerService {
  private static jobs: Record<string, ScheduledTask> = {}

  static start() {
    if (this.jobs.rotation) {
      return { started: false, reason: "Scheduler already running." }
    }

    const principal = new PrincipalRotationService()
    const research = new TeacherResearchService()
    const content = new SocialContentFactoryService()
    const editor = new SocialEditorService()
    const autoposter = new AutoPosterService()
    const verifier = new VerifyAgentService()

    this.jobs.rotation = cron.schedule("0 * * * *", async () => {
      await principal.rotateHourly()
    })

    this.jobs.research = cron.schedule("*/10 * * * *", async () => {
      const teachers = AcademyRegistryService.getTeachers().slice(0, 12)
      for (const teacher of teachers) {
        try {
          const mem = await research.performResearch(teacher.id)
          await verifier.verifyMemoryRecord(mem.id)
        } catch {
          // keep loop alive
        }
      }
    })

    this.jobs.content = cron.schedule("*/20 * * * *", async () => {
      const categories = ["ai", "crypto", "markets", "automation"]

      for (const category of categories) {
        try {
          const draft = await content.buildFromCategory(category)
          const v1 = await verifier.verifySocialMemory(draft.id)
          if (v1.ok) {
            await editor.editDraft(draft.id)
            const platform =
              (draft.prediction?.platformFit?.youtube ?? 0) >= (draft.prediction?.platformFit?.instagram ?? 0) &&
              (draft.prediction?.platformFit?.youtube ?? 0) >= (draft.prediction?.platformFit?.tiktok ?? 0)
                ? "youtube"
                : (draft.prediction?.platformFit?.instagram ?? 0) >= (draft.prediction?.platformFit?.tiktok ?? 0)
                ? "instagram"
                : "tiktok"

            const prod = await editor.sendToProduction(draft.id, platform)
            await verifier.verifyProductionRecord(prod.id)
          }
        } catch {
          // keep loop alive
        }
      }
    })

    this.jobs.queue = cron.schedule("*/30 * * * *", async () => {
      await autoposter.queueAllReady()
    })

    this.jobs.publish = cron.schedule("*/15 * * * *", async () => {
      await autoposter.publishScheduled()
    })

    return { started: true }
  }

  static stop() {
    Object.values(this.jobs).forEach((job) => job.stop())
    this.jobs = {}
    return { stopped: true }
  }

  static status() {
    return {
      running: Object.keys(this.jobs),
      active: Object.keys(this.jobs).length > 0,
    }
  }
}
