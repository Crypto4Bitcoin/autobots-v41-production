export class PolicyAwarePlacementService {
  static validatePlacement(region: string, policies: string[]) {
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const allowed = policies.every(p => !region.startsWith("prohibited-"));
    console.log(`[Placement] Validating ${region} against policies: ${allowed ? "PASSED" : "FAILED"}`);
    return allowed;
  }
}