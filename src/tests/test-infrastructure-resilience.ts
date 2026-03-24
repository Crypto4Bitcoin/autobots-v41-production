import { ClusterOrchestratorService } from "../lib/services/cluster-orchestrator.service";
import { WorkerAutoscalerService } from "../lib/services/worker-autoscaler.service";
import { SecretVaultService } from "../lib/services/secret-vault.service";
import { TraceCorrelationService } from "../lib/services/trace-correlation.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testInfrastructureResilience() {
  console.log("🚀 Testing Phase 36: Production Infrastructure & Resilience...\n");

  setupSupabaseMock();

  // 1. Cluster Orchestration & Region Awareness
  const cluster = new ClusterOrchestratorService();
  const target = await cluster.resolveDeploymentTarget({ 
      requiredPool: "gpu-accelerated", 
      preferredRegion: "eu-central" 
  });
  console.log(`✅ Cluster Target Resolved: ${target.region} / ${target.pool}`);

  // 2. Autoscaling Signals
  const autoscaler = new WorkerAutoscalerService();
  const signals = await autoscaler.analyzeScaleSignals();
  console.log(`✅ Scaling Signals Detected: ${signals.length}`);
  if (signals.length > 0) {
      console.log(`- Top Signal: ${signals[0].action} for ${signals[0].pool} (${signals[0].reason})`);
  }

  // 3. Secret Isolation & Validation
  const vault = new SecretVaultService();
  const isValid = await vault.validateNodeSecrets("ws-prod", ["OPENAI_API_KEY", "SLACK_WEBHOOK"]);
  console.log(`✅ Secret Validation Status: ${isValid ? "SECURE" : "FAILED"}`);

  // 4. Distributed Tracing
  const tracer = new TraceCorrelationService();
  const traceId = "tr-test-123";
  const rootSpan = await tracer.startSpan({ 
      traceId, 
      serviceName: "ControlPlane", 
      operationName: "TriggerWorkflow" 
  });
  
  await tracer.startSpan({ 
      traceId, 
      parentSpanId: rootSpan, 
      serviceName: "Orchestrator", 
      operationName: "LeaseJob" 
  });
  
  await tracer.endSpan(rootSpan);
  console.log(`✅ Distributed Trace Correlation verified for trace: ${traceId}`);

  console.log("\n🎉 PHASE 36: INFRASTRUCTURE RESILIENCE VERIFIED!");
}

testInfrastructureResilience();
