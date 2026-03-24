export class AdversarialPatternDetector {
  async detect(behavior: unknown): Promise<boolean> {
    const suspicious = ['rapid_privilege_escalation', 'data_exfiltration', 'audit_bypass']
    return suspicious.includes(behavior.type)
  }
}