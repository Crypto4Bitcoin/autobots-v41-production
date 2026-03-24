// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextResponse } from "next/server";

export interface MaintenanceAgentRecord {
  agent_id: string;
  agent_name: string;
  agent_class: "monitor" | "diagnostic" | "repair" | "verifier" | "governor";
  inputs: string[];
  outputs: string[];
  memory_access: "read_only" | "read_write" | "quarantined";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  repair_scope: Record<string, any> | null;
  risk_level: "low" | "medium" | "high" | "critical";
  approval_required: boolean;
  fallback_agent?: string;
  status: "active" | "standby" | "disabled";
}

export interface RuntimeRecord {
  region: string;
  endpoint: string;
  status: "online" | "degraded" | "offline";
}

export class MaintenanceRegistryService {
  private static agents: Map<string, MaintenanceAgentRecord> = new Map();
  private static runtimes: RuntimeRecord[] = [];

  static initialize() {
    // Seed Agents
    this.register({
      agent_id: "sentinel-01",
      agent_name: "SentinelAgent",
      agent_class: "monitor",
      inputs: ["logs", "metrics", "traces"],
      outputs: ["incident_streams"],
      memory_access: "read_only",
      repair_scope: null,
      risk_level: "low",
      approval_required: false,
      status: "active"
    });

    // Seed Runtimes (for failover drills)
    this.registerRuntime({ region: "us-east-1", endpoint: "https://use1.autobots.io", status: "online" });
    this.registerRuntime({ region: "eu-west-1", endpoint: "https://euw1.autobots.io", status: "online" });
    this.registerRuntime({ region: "ap-southeast-1", endpoint: "https://apse1.autobots.io", status: "online" });
  }

  static register(agent: MaintenanceAgentRecord) {
    this.agents.set(agent.agent_id, agent);
    console.log("[Registry] Registered Maintenance Agent: " + agent.agent_name);
  }

  static registerRuntime(runtime: RuntimeRecord) {
    this.runtimes.push(runtime);
    console.log("[Registry] Registered Runtime: " + runtime.region);
  }

  static listRuntimes(): RuntimeRecord[] {
    return this.runtimes;
  }

  static getAgent(id: string): MaintenanceAgentRecord | undefined {
    return this.agents.get(id);
  }

  static listAgents(): MaintenanceAgentRecord[] {
    return Array.from(this.agents.values());
  }

  static updateStatus(id: string, status: MaintenanceAgentRecord["status"]) {
    const agent = this.getAgent(id);
    if (agent) agent.status = status;
  }
}

MaintenanceRegistryService.initialize();