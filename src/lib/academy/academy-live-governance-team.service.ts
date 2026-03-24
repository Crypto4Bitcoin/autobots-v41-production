import { MemoryStoreService } from "./memory-store.service"
import { AcademyRegistryService } from "./academy-registry.service"
import { AcademySchedulerService } from "./scheduler.service"

export class AcademyLiveGovernanceTeamService {
  async startSchool() {
    AcademyRegistryService.updateAgent("chancellor-001", { status: "governing" })
    AcademyRegistryService.updateAgent("deanops-001", { status: "governing" })
    AcademyRegistryService.updateAgent("marshal-001", { status: "governing" })
    AcademyRegistryService.updateAgent("balancer-001", { status: "governing" })
    AcademyRegistryService.updateAgent("audit-001", { status: "governing" })
    AcademyRegistryService.updateAgent("verify-001", { status: "governing" })

    MemoryStoreService.setSchoolState({
      live: true,
      mode: "running",
      startedAt: new Date().toISOString(),
      pauseReason: undefined,
    })

    const scheduler = AcademySchedulerService.start()

    return {
      live: true,
      mode: "running",
      scheduler,
      governedBy: MemoryStoreService.getSchoolState().overseenBy,
    }
  }

  async stopSchool() {
    ;["chancellor-001", "deanops-001", "marshal-001", "balancer-001", "audit-001", "verify-001"].forEach((id) => {
      AcademyRegistryService.updateAgent(id, { status: "paused" })
    })

    const scheduler = AcademySchedulerService.stop()

    MemoryStoreService.setSchoolState({
      live: false,
      mode: "stopped",
      stoppedAt: new Date().toISOString(),
      pauseReason: "School manually stopped by governance team.",
    })

    return {
      live: false,
      mode: "stopped",
      scheduler,
      governedBy: MemoryStoreService.getSchoolState().overseenBy,
    }
  }

  async pauseSchool(reason: string) {
    AcademySchedulerService.stop()

    MemoryStoreService.setSchoolState({
      live: false,
      mode: "paused",
      pauseReason: reason,
    })

    return {
      live: false,
      mode: "paused",
      reason,
      governedBy: MemoryStoreService.getSchoolState().overseenBy,
    }
  }

  async status() {
    return {
      school: MemoryStoreService.getSchoolState(),
      scheduler: AcademySchedulerService.status(),
      governors: AcademyRegistryService.getAllAgents().filter((a) =>
        ["chancellor", "dean_ops", "schedule_marshal", "curriculum_balancer", "school_audit", "verify"].includes(a.role)
      ),
    }
  }
}
