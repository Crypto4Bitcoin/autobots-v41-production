import { PipelineState } from "../types/enums";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Agent, AgentInput, AgentOutput, JobResult } from "../types/agent-types";
import { DBService, supabase } from "../services/supabase-service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PipelineStateService } from "../services/pipeline-state-service";
import { PolicyService } from "../services/policy-service";
import { OptimizationService } from "../services/optimization-service";
import { WorkflowEngine } from "../services/workflow-engine";
import { CapabilityRegistryService } from "../services/capability-registry-service";
import { HumanTaskService } from "../services/human-task-service";
import { ToolAdapterService } from "../services/tool-adapter-service";

import { TrendScoutAgent } from "../agents/trend-scout-agent";
import { GovernanceService } from "../services/governance-service";
import { PackRegistryService } from "../services/pack-registry-service";

export interface Job {
  id?: string;
  pipelineItemId: string;
  workspaceId: string;
  targetState: PipelineState;
  payload: unknown;
}

export class QueueService {
  public static workerId = typeof crypto !== 'undefined' ? crypto.randomUUID() : "worker-1";
  private static isRunning = false;
  private static pollInterval = 3000;

  static async enqueue(job: Job) {
    await DBService.enqueueJob({
      pipeline_item_id: job.pipelineItemId,
      workspace_id: job.workspaceId,
      target_state: job.targetState,
      payload: job.payload
    });
    if (!this.isRunning) this.startWorker();
  }

  static async startWorker() {
    if (this.isRunning) return;
    this.isRunning = true;
    console.log(`[Queue] Worker ${this.workerId} started polling...`);

    let currentInterval = this.pollInterval;
    while (this.isRunning) {
      try {
        const jobData = await DBService.fetchPendingJob(this.workerId);
        if (jobData) {
          currentInterval = this.pollInterval;
          const result = await Orchestrator.processJob({
            id: jobData.id,
            pipelineItemId: jobData.pipeline_item_id,
            workspaceId: jobData.workspace_id,
            targetState: jobData.target_state as PipelineState,
            payload: jobData.payload
          }, this.workerId);
          
          const status = result.outcome === "completed" ? "completed" : 
                         result.outcome === "retry" ? "pending" : "failed";
          
          if (status === "pending") await DBService.failJobWithRetry(jobData.id, result.reason || "", this.workerId);
          else await DBService.updateJobStatus(jobData.id, status, result.reason || "", this.workerId);
          continue;
        }

        const nodeRun = await DBService.fetchPendingNodeRun(this.workerId);
        if (nodeRun) {
          currentInterval = this.pollInterval;
          await Orchestrator.processNodeRun(nodeRun, this.workerId);
          continue;
        }

        await new Promise(resolve => setTimeout(resolve, currentInterval));
        currentInterval = Math.min(30000, currentInterval * 1.5);
      } catch (err) {
        console.error(`[Queue] Error:`, err);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
}

export class Orchestrator {
  private static agentRegistry: Map<PipelineState, Agent> = new Map();

  static registerAgent(state: PipelineState, agent: Agent) {
    this.agentRegistry.set(state, agent);
  }

  /**
   * Legacy State-Machine Processing (Hardened)
   */
  static async processJob(job: Job, workerId: string): Promise<JobResult> {
    const { pipelineItemId, workspaceId, targetState, payload } = job;
    const hasLock = await DBService.acquireLock(pipelineItemId, workspaceId, workerId);
    if (!hasLock) return { outcome: "skipped", reason: "lock_failure" };

    try {
      const item = await DBService.getPipelineItem(pipelineItemId);
      const [workspaceConfig, queueDepth, tuningMetrics] = await Promise.all([
        DBService.getWorkspaceConfig(workspaceId),
        DBService.getQueueDepth(workspaceId),
        OptimizationService.getLatestMetrics(workspaceId)
      ]);

      const policyContext = PolicyService.getExecutionContext({
        workspacePolicy: workspaceConfig,
        itemMetadata: item.metadata,
        targetState,
        queueDepth,
        contentPreview: item.title,
        tuningMetrics
      });

      const agent = this.agentRegistry.get(targetState);
      if (!agent) return { outcome: "failed", reason: "Agent not found" };

      const input: AgentInput = {
        pipelineItemId,
        workspaceId,
        inputState: item.current_state as PipelineState,
        targetState,
        payload,
        context: policyContext,
        parentArtifactId: item.last_artifact_id
      };
      
      const output = await agent.process(input);
      const agentRun = await DBService.logAgentRun({
        pipeline_item_id: pipelineItemId,
        workspace_id: workspaceId,
        agent_name: agent.name,
        input_state: item.current_state,
        output_state: output.nextState || targetState,
        status: output.status,
        latency_ms: 0, // Mocked
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      });

      if (output.status === "success") {
          if (output.artifact) {
              await DBService.createArtifact({
                workspace_id: workspaceId,
                pipeline_item_id: pipelineItemId,
                agent_run_id: agentRun.id,
                parent_artifact_id: item.last_artifact_id,
                type: output.artifact.type || "output",
                data: output.artifact.data || output.output
              });
          }
          await DBService.updatePipelineState(pipelineItemId, output.nextState || targetState);
          return { outcome: "completed" };
      }
      return { outcome: "failed", reason: "Agent failed" };
    } finally {
      await DBService.releaseLock(pipelineItemId, workerId);
    }
  }

  /**
   * New Capability-Based Node Processing (Phase 8)
   */
  static async processNodeRun(nodeRun: unknown, workerId: string) {
    const { id, pipeline_item_id, workspace_id, workflow_run_id } = nodeRun;
    const hasLock = await DBService.acquireLock(pipeline_item_id, workspace_id, workerId);
    if (!hasLock) return;

    try {
      // 1. Resolve Capability
      const { data: node } = await supabase
        .from("workflow_nodes")
        .select("*")
        .eq("id", nodeRun.workflow_node_id)
        .single();
      
      const executor = await CapabilityRegistryService.resolveExecutor(node);
      if (!executor) {
          await DBService.updateNodeRunStatus(id, "failed");
          return;
      }

      // 1b. Phase 11 Governance & Pack Checks
      const capabilityKey = node.capability_key;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const trustTier = (node as any).trust_tier || 1;

      const [isPackEnabled, govCheck] = await Promise.all([
          PackRegistryService.isCapabilityEnabled(workspace_id, capabilityKey),
          GovernanceService.validateExecution(workspace_id, capabilityKey, trustTier)
      ]);

      if (!isPackEnabled) {
          await DBService.updateNodeRunStatus(id, "failed");
          console.warn(`[Orchestrator] Pack for ${capabilityKey} is not enabled for workspace ${workspace_id}.`);
          return;
      }

      if (!govCheck.allowed) {
          await DBService.updateNodeRunStatus(id, "failed");
          console.warn(`[Orchestrator] Governance blocked ${capabilityKey}: ${govCheck.reason}`);
          return;
      }

      // 1c. Mandatory Review Gate (Tier-based)
      if (govCheck.requiresReview && executor.type !== "human_task") {
          console.log(`[Orchestrator] Trust Tier ${trustTier} requires mandatory review for ${capabilityKey}`);
          await HumanTaskService.createRequest({
              workflowRunId: workflow_run_id,
              nodeRunId: id,
              workspaceId: workspace_id,
              instructions: `Mandatory Governance Review: High-Tier Capability [${capabilityKey}] invoked.`,
              inputData: { capabilityKey, trustTier }
          });
          await DBService.updateNodeRunStatus(id, "waiting");
          return;
      }

      // 2. Route Execution (Phase 8 Extension)
      if (executor.type === "human_task") {
          const item = await DBService.getPipelineItem(pipeline_item_id);
          await HumanTaskService.createRequest({
              workflowRunId: workflow_run_id,
              nodeRunId: id,
              workspaceId: workspace_id,
              instructions: `Please review the output for ${item.title}`,
              inputData: { last_artifact_id: item.last_artifact_id }
          });
          await DBService.updateNodeRunStatus(id, "waiting");
          return;
      }

      if (executor.type === "api_action" || executor.type === "tool_adapter") {
          const result = await ToolAdapterService.execute(executor, {});
          if (result.success) {
              await WorkflowEngine.completeNode(id, "completed");
              await DBService.updateNodeRunStatus(id, "completed");
          } else {
              await DBService.updateNodeRunStatus(id, "failed");
          }
          return;
      }

      // 3. Agent Execution (Internal)
      this.agentRegistry.set(PipelineState.RESEARCHING, new TrendScoutAgent());
      const targetState = PipelineState.RESEARCHING; // Mock mapping for internal agent registry
      const agent = this.agentRegistry.get(targetState);
      
      if (agent) {
          const input: AgentInput = {
            pipelineItemId: pipeline_item_id,
            workspaceId: workspace_id,
            workflowRunId: workflow_run_id,
            nodeRunId: id,
            inputState: PipelineState.INPUT_RECEIVED, // Mocked
            targetState,
            payload: {},
          };
          const output = await agent.process(input);
          
          if (output.status === "success") {
              let artId: string | undefined;
              if (output.artifact) {
                  const art = await DBService.createArtifact({
                    workspace_id,
                    pipeline_item_id: pipeline_item_id,
                    type: output.artifact.type || "node_output",
                    data: output.artifact.data || output.output
                  });
                  artId = art.id;
              }
              await WorkflowEngine.completeNode(id, "completed");
              await DBService.updateNodeRunStatus(id, "completed", artId);
          } else {
              await DBService.updateNodeRunStatus(id, "failed");
          }
      }
    } catch (err) {
        console.error(`[Orchestrator] Node execution failed:`, err);
        await DBService.updateNodeRunStatus(id, "failed");
    } finally {
      await DBService.releaseLock(pipeline_item_id, workerId);
      await DBService.releaseJobLock(pipeline_item_id, workerId);
    }
  }
}
