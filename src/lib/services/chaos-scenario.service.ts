export interface ChaosScenario {
  scenario_id: string;
  failure_type: 'api_latency' | 'process_kill' | 'memory_corruption' | 'network_partition' | 'region_failure';
  target_component: string;
  blast_radius: 'single_service' | 'single_runtime' | 'multi_region';
  expected_response: string;
  recovery_timeout: string;
}

export class ChaosScenarioService {
  private static scenarios: ChaosScenario[] = [
    {
      scenario_id: "api_timeout_01",
      failure_type: "api_latency",
      target_component: "workflow_runtime",
      blast_radius: "single_runtime",
      expected_response: "retry_then_failover",
      recovery_timeout: "30s"
    },
    {
      scenario_id: "agent_crash_01",
      failure_type: "process_kill",
      target_component: "NurseAgent",
      blast_radius: "single_service",
      expected_response: "worker_respawn",
      recovery_timeout: "10s"
    }
  ];

  static getScenario(id: string) {
    return this.scenarios.find(s => s.scenario_id === id);
  }

  static listScenarios() {
    return this.scenarios;
  }
}
