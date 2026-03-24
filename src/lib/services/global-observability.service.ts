export interface GlobalTrace {
  workflow_id: string;
  hop_id: string;
  source_runtime: string;
  target_runtime: string;
  status: string;
  latency: number;
  timestamp: string;
}

export class GlobalObservabilityService {
  private static traces: GlobalTrace[] = [];

  static recordHop(trace: GlobalTrace) {
    this.traces.push(trace);
    console.log(`[GlobalObs] Workflow ${trace.workflow_id} moved: ${trace.source_runtime} -> ${trace.target_runtime}`);
  }

  static getWorkflowLineage(workflowId: string): GlobalTrace[] {
    return this.traces.filter(t => t.workflow_id === workflowId);
  }

  static listAllHops(): GlobalTrace[] {
    return this.traces;
  }
}
