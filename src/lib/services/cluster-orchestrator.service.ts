// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DBService, supabase } from "./supabase-service";

export type WorkerPool = "general" | "cpu-intensive" | "gpu-accelerated" | "browser-farm";
export type Region = "us-east" | "us-west" | "eu-central" | "ap-southeast";

export interface ClusterNode {
  id: string;
  hostname: string;
  region: Region;
  pool: WorkerPool;
  status: "active" | "cordoned" | "draining";
  last_heartbeat: string;
}

export class ClusterOrchestratorService {
  /**
   * Registers or updates a worker in the cluster registry with region and pool awareness.
   */
  async heartBeat(node: Omit<ClusterNode, "last_heartbeat" | "status">) {
    const { data, error } = await supabase
      .from("cluster_nodes")
      .upsert([{
        ...node,
        status: "active",
        last_heartbeat: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Finds the best region/pool for a specific workload.
   * Logic: Affinity to region if specified, otherwise least loaded pool.
   */
  async resolveDeploymentTarget(workload: { 
    requiredPool?: WorkerPool; 
    preferredRegion?: Region;
  }): Promise<{ region: Region; pool: WorkerPool }> {
    console.log(`[ClusterOrchestrator] Resolving target for ${workload.requiredPool || "general"} workload...`);
    
    // Simplification: In a real distributed system, we'd query node load stats.
    return {
      region: workload.preferredRegion || "us-east",
      pool: workload.requiredPool || "general"
    };
  }

  /**
   * Cordon a worker to prevent new jobs during rolling upgrades.
   */
  async cordonNode(nodeId: string) {
    console.log(`[ClusterOrchestrator] Cordoning node ${nodeId} for maintenance...`);
    await supabase
      .from("cluster_nodes")
      .update({ status: "cordoned" })
      .eq("id", nodeId);
  }
}
