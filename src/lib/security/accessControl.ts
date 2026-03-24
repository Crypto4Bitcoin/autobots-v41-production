export function verifyZeroTrust(agentTrust: number, taskRiskScore: number): boolean {
  // item 125: Zero-trust access system
  // tasks with risk > 70 require trust > 85
  if (taskRiskScore > 70) return agentTrust > 85;
  // tasks with risk > 40 require trust > 60
  if (taskRiskScore > 40) return agentTrust > 60;
  return true;
}
