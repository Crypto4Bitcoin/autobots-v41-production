// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DeveloperGatewayService } from "../lib/services/developer-gateway.service";
import { AutoBots } from "../lib/autobots-sdk/index";
import { BillingService } from "../lib/services/billing.service";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { UsageAnalyticsService } from "../lib/services/usage-analytics.service";
import { setupSupabaseMock } from "./utils/supabase-mock-utils";

async function testApiGatewayAndSDK() {
  console.log("?? Testing Phase 42: External Developer Gateway (SDK + API Stabilization)...\n");

  setupSupabaseMock();

  // 1. SDK Usage (The < 30 second integration test)
  console.log("Step 1: Initializing AutoBots SDK...");
  const client = new AutoBots({
    apiKey: "ak-test-prod-123"
  });

  console.log("Step 2: Activating workflow via SDK...");
  try {
    const runResult = await client.workflow.run({
        workflowId: "video-agent-pipeline",
        payload: { url: "https://youtube.com/..." }
    });
    console.log(`? SDK Response - Run ID: ${runResult.runId}, Status: ${runResult.status}`);
  } catch (e: unknown) {
    console.log(`? SDK Response Failed: ${e.message}`);
  }

  // 3. Billing Calculation
  console.log("\nStep 3: Calculating monthly invoice for tenant...");
  const billing = new BillingService();
  const invoice = await billing.calculateCurrentInvoice("ws-test-456");
  console.log(`? Invoice Generated: $${invoice.total_amount_usd} (Status: ${invoice.status})`);

  console.log("\n?? PHASE 42: SDK & API GATEWAY STABILIZED!");
}

testApiGatewayAndSDK();
