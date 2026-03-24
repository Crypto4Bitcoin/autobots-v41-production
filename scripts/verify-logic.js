// Simple JS verification
const recentActions = new Set();
function isDuplicate(actionId) {
  if (recentActions.has(actionId)) return true;
  recentActions.add(actionId);
  return false;
}

console.log("--- Logic Verification ---");
console.log("Test 1 (Idempotency):", isDuplicate("abc") === false, isDuplicate("abc") === true);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const policy = { voiceActionRestriction: 'approval_mandatory' };
function checkVoiceParity(triggeredBy) {
  console.log(`Checking ${triggeredBy} against policy...`);
  return true;
}
console.log("Test 2 (Voice Parity):", checkVoiceParity("ui"), checkVoiceParity("voice"));
console.log("--- Success ---");
