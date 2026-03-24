import { DeveloperPortalService } from '../lib/ecosystem/developer-portal.service';
import { MarketplaceTrustValidator } from '../lib/ecosystem/marketplace-trust-validator';
import { DeveloperApiKeyService } from '../lib/ecosystem/developer-api-key.service';

async function runTests() {
  console.log("--- Starting Phase 76 Ecosystem Verification ---");

  const developerId = 'dev_alpha_99';

  // 1. Test Project Registration
  console.log("\n[Test 1] Verifying Project Registration");
  const project = await DeveloperPortalService.registerProject("Autonomous SEO Agent Pack", developerId);
  console.log(`Registered Project: ${project.name} | Status: ${project.status}`);
  console.assert(project.id.startsWith('proj_'), "Project ID should be correctly generated!");

  // 2. Test Trust Validation
  console.log("\n[Test 2] Verifying Trust Validation");
  const isTrusted = await MarketplaceTrustValidator.validateTrustScheme(project.id);
  console.log(`Trust Validation Result: ${isTrusted ? 'PASSED' : 'FAILED'}`);
  console.assert(isTrusted === true, "Mock trust validation should pass!");

  // 3. Test API Key Issuance
  console.log("\n[Test 3] Verifying API Key Issuance");
  const key = DeveloperApiKeyService.generateKey(developerId);
  console.log(`Issued Key: ${key.substring(0, 15)}...`);
  const isValid = DeveloperApiKeyService.validateKey(key);
  console.assert(isValid === true, "Generated key should be valid!");

  console.log("\n--- Ecosystem Verification Complete ---");
}

runTests().catch(console.error);
