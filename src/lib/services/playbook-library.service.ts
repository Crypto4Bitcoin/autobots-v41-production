export interface Playbook {
  playbook_id: string;
  incident_pattern: string;
  repair_steps: string[];
  verification_steps: string[];
  rollback_strategy: string;
  approval_requirement: "automatic" | "governor_approval" | "human_approval";
}

export class PlaybookLibraryService {
  private static playbooks: Map<string, Playbook> = new Map();

  static initialize() {
    this.addPlaybook({
      playbook_id: "PB-ROUTE-RECON",
      incident_pattern: "404 Route Mismatch",
      repair_steps: ["detect route 404", "diagnose alias mismatch", "patch route map"],
      verification_steps: ["navigation test", "status check"],
      rollback_strategy: "atomic_revert",
      approval_requirement: "automatic"
    });
  }

  static addPlaybook(pb: Playbook) {
    console.log(`[PlaybookLibrary] Registering PERSISTENT playbook: ${pb.playbook_id}`);
    this.playbooks.set(pb.playbook_id, pb);
  }

  static findPlaybook(pattern: string): Playbook | undefined {
    return Array.from(this.playbooks.values()).find(pb => pb.incident_pattern === pattern);
  }

  static getPlaybookForIncident(pattern: string): Playbook | undefined {
    return this.findPlaybook(pattern);
  }
}

PlaybookLibraryService.initialize();