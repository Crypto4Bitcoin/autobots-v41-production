import { GlobalRuntimeRegistryService } from "./global-runtime-registry.service";
import { GlobalPolicyAuthorityService } from "./global-policy-authority.service";
import { GlobalCapabilityIndexService } from "./global-capability-index.service";

export class GlobalRoutingService {
  static async routeWorkflow(workflowData: unknown): Promise<{ selected_runtime: string; mode: string }> {
    console.log(`[GlobalRouting] Deciding route for workflow: ${workflowData.type}`);
    
    // 1. Capability Check
    const candidates = GlobalCapabilityIndexService.findRuntimes(workflowData.required_capability || 'workflow');
    
    // 2. Policy Check
    const allowedRuntimes = candidates.filter(id => {
      const runtime = GlobalRuntimeRegistryService.getRuntime(id);
      if (!runtime) return false;
      return GlobalPolicyAuthorityService.validate(workflowData.org_id, runtime.region, 'execution').allowed;
    });

    if (allowedRuntimes.length === 0) {
      throw new Error("No policy-compliant runtimes available for required capability");
    }

    // 3. Health & Latency (Simplified select first healthy)
    const selected = GlobalRuntimeRegistryService.getRuntime(allowedRuntimes[0]);
    
    return {
      selected_runtime: selected?.runtime_id || "fallback-us",
      mode: "capability_first"
    };
  }
}
