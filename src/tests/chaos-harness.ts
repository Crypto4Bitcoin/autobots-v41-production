import { supabase } from "../lib/services/supabase-service";

export class ChaosHarness {
  /**
   * Simulates a sudden worker crash mid-execution.
   */
  async simulateWorkerCrash(nodeId: string) {
    console.log(`[ChaosHarness] INJECTING FAILURE: Terminating worker ${nodeId} abruptly...`);
    
    // In production chaos, we'd actually kill the process/pod.
    // Here we simulate it by failing heartbeats and letting leases expire.
    await supabase.from("cluster_nodes").delete().eq("id", nodeId);
    
    await supabase.from("infrastructure_events").insert([{
        event_type: "chaos_worker_crash",
        payload: { nodeId, timestamp: new Date().toISOString() }
    }]);
  }

  /**
   * Simulates database connection instability.
   */
  async simulateNetworkPartition(serviceName: string) {
    console.log(`[ChaosHarness] INJECTING FAILURE: Simulating network partition for ${serviceName}...`);
    // This would be implemented by temporarily intercepting/failing supabase-mock calls.
  }
}
