export class RepairDoctorAgent {
  async diagnose(incident: unknown): Promise<string> {
    if (incident.type === "missing" && incident.targetModule.includes("/ui/")) {
      return "generate_stub"
    }
    if (incident.type === "case_mismatch") {
      return "align_case"
    }
    return "escalate"
  }
}