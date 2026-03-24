
export class BuildDoctorAgent {
  static diagnose(incident: unknown) {
    console.log("[Doctor] Diagnosing incident:", incident.incident_id);
    const msg = incident.raw_message?.toLowerCase() || "";

    if (msg.includes("unicode escape") || msg.includes("parsing ecmascript") || msg.includes("invalid or unexpected token")) {
      return {
        diagnosis_id: Date.now().toString(),
        incident_id: incident.incident_id,
        root_cause: "generated code inserted literal newline escape",
        repair_type: "safe_code_patch",
        playbook: "Literal Escape Injection Repair",
        confidence: 0.98
      };
    }

    if (msg.includes("module not found") || msg.includes("can't resolve")) {
      return {
        diagnosis_id: Date.now().toString(),
        incident_id: incident.incident_id,
        root_cause: "missing internal dependency",
        repair_type: "safe_code_patch",
        playbook: "Missing Module Stub Repair",
        confidence: 0.90
      };
    }

    if (msg.includes("../../../lib") || msg.includes("../../lib")) {
      return {
        diagnosis_id: Date.now().toString(),
        incident_id: incident.incident_id,
        root_cause: "fragile relative path",
        repair_type: "safe_code_patch",
        playbook: "Path Alias Normalization",
        confidence: 0.95
      };
    }

    if (msg.includes("nextresponse") || msg.includes("api route contact")) {
       return {
        diagnosis_id: Date.now().toString(),
        incident_id: incident.incident_id,
        root_cause: "route contract violation",
        repair_type: "safe_code_patch",
        playbook: "Route Handler Contract Repair",
        confidence: 0.92
      };
    }

    return { status: "unknown_error", recommendation: "Manual Review", diagnosis_id: "error" };
  }
}
