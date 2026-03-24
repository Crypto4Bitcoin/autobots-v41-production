import { execSync } from "child_process";

const tests = [
  "src/tests/test-stress-recovery.ts",
  "src/tests/test-stress-voice.ts",
  "src/tests/test-stress-research.ts",
  "src/tests/test-stress-mixed.ts",
  "src/tests/test-stress-media.ts",
  "src/tests/test-autonomous-assembly.ts",
  "src/tests/test-workflow-memory.ts",
  "src/tests/test-visual-builder.ts",
  "src/tests/test-workflow-supervisor.ts",
  "src/tests/test-pack-ecosystem.ts",
  "src/tests/test-agent-workforce.ts",
  "src/tests/test-platform-intelligence.ts",
  "src/tests/test-workforce-planner.ts",
  "src/tests/test-runtime-recovery.ts",
  "src/tests/test-cost-intelligence.ts",
  "src/tests/test-knowledge-graph.ts",
  "src/tests/test-control-plane.ts",
  "src/tests/test-event-reconstruction.ts",
  "src/tests/test-worker-clustering.ts",
  "src/tests/test-async-projections.ts",
  "src/tests/test-production-hardening.ts",
  "src/tests/test-control-plane-ops.ts",
  "src/tests/test-replay-forensics.ts",
  "src/tests/test-autonomy-modes.ts",
  "src/tests/test-marketplace-ecosystem.ts",
  "src/tests/test-workflow-evolution.ts",
  "src/tests/test-strategic-workforce.ts",
  "src/tests/test-global-task-graph.ts",
  "src/tests/test-platform-guardrails.ts",
  "src/tests/test-deterministic-equivalence.ts",
  "src/tests/test-infrastructure-resilience.ts",
  "src/tests/test-extreme-load-chaos.ts",
  "src/tests/test-operation-visibility.ts",
  "src/tests/test-control-plane-commands.ts",
  "src/tests/test-cost-accounting.ts",
  "src/tests/test-budget-enforcement.ts",
  "src/tests/test-evolution-intelligence.ts",
  "src/tests/test-evolution-simulation.ts",
  "src/tests/test-marketplace-provisioning.ts",
  "src/tests/test-api-gateway-usage.ts",
  "src/tests/test-autonomic-optimization.ts",
  "src/tests/test-autonomic-healing.ts"
];

console.log("🛠️ Starting AutoBots Platform Regression Suite...\n");

let passed = 0;
let failed = 0;

tests.forEach(test => {
  console.log(`Running: ${test}...`);
  try {
    execSync(`npx tsx ${test}`, { stdio: 'inherit' });
    console.log(`✅ ${test} PASSED\n`);
    passed++;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error(`❌ ${test} FAILED\n`);
    failed++;
  }
});

console.log("-----------------------------------------");
console.log(`Regression Suite Results: ${passed} Passed, ${failed} Failed`);
console.log("-----------------------------------------");

if (failed > 0) process.exit(1);
process.exit(0);
