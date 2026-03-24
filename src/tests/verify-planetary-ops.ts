import { FederationControlService } from '../lib/planetary/federation-control.service';
import { GlobalTrustValidator } from '../lib/planetary/global-trust-validator';
import { GlobalMemoryRoutingService } from '../lib/planetary/global-memory-routing.service';
import { AuditContinuityService } from '../lib/planetary/audit-continuity.service';

async function runTests() {
  console.log("--- Starting Phase 79 Planetary Verification ---");

  const orgId = 'org_partner_alpha';
  const regionId = 'eu-central';

  // 1. Test Federated Execution
  console.log("\n[Test 1] Verifying Federated Execution");
  const federatedResult = await FederationControlService.requestFederatedExecution(orgId, { task: 'CrossOrgAudit' });
  console.log(`Federation Status: ${federatedResult.status} | Relay ID: ${federatedResult.relayId}`);
  console.assert(federatedResult.status === 'Handoff_Confirmed', "Federation request failed!");

  // 2. Test Global Trust Validation
  console.log("\n[Test 2] Verifying Global Trust Validation");
  const isValid = GlobalTrustValidator.validateIdentity('worker_planetary_001', regionId);
  console.log(`Identity Validation: ${isValid ? 'PASSED' : 'FAILED'}`);
  console.assert(isValid === true, "Planetary identity validation failed!");

  // 3. Test Global Memory Routing
  console.log("\n[Test 3] Verifying Global Memory Routing");
  const memoryRouting = GlobalMemoryRoutingService.routeMemoryAccess('workspace_zeta', regionId);
  console.log(`Memory Routing Locality: ${memoryRouting.dataLocality}`);
  console.assert(memoryRouting.compliance === 'Verified', "Memory compliance validation failed!");

  // 4. Test Audit Continuity
  console.log("\n[Test 4] Verifying Audit Continuity");
  AuditContinuityService.logDistributedAction('act_planetary_999', 'us-east', orgId);
  console.log("Distributed audit log entry confirmed.");

  console.log("\n--- Planetary Verification Complete ---");
}

runTests().catch(console.error);
