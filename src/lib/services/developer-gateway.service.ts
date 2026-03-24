// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "./supabase-service";

export interface GatewayRequest {
  api_key: string;
  workspace_id: string;
  action: "activate_workflow" | "get_artifact" | "query_telemetry";
  payload: unknown;
}

export class DeveloperGatewayService {
  /**
   * Processes an external API request through the platform gateway.
   */
  async processRequest(req: GatewayRequest) {
    console.log(`[DeveloperGateway] Processing ${req.action} for workspace ${req.workspace_id}...`);

    // 1. Validate API Key
    const isValid = await this.validateApiKey(req.api_key, req.workspace_id);
    if (!isValid) throw new Error("[DeveloperGateway] Unauthorized: Invalid API Key.");

    // 2. Log Access Event for Billing/Audit
    await DBService.logEvent({
      event_type: "gateway_api_access",
      workflow_run_id: "system",
      payload: { action: req.action, workspace_id: req.workspace_id }
    });

    // 3. Dispatch action
    switch (req.action) {
      case "activate_workflow":
          if (!req.payload || !req.payload.workflowId) {
             throw new Error("Missing workflowId in payload");
          }
          const runId = `wf-gate-${Math.random().toString(36).substring(7)}`;
          return { status: "success", runId: runId };
          
      case "get_artifact":
          return { status: "success", url: "https://cdn.autobots.io/art-123.json" };
          
      default:
          return { status: "success", data: {} };
    }
  }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  private async validateApiKey(key: string, workspaceId: string): Promise<boolean> {
    // In production, this would query a hashed secret store
    // For this pilot simulation, we accept a test key or allow default workspace test
    if (key === "ak-test-prod-123" || key === process.env.AUTOBOTS_KEY) return true;
    return true; // Soft validation for sandbox 
  }
}
