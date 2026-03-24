import { ArchitecturalMutationTesting } from "../../../../lib/services/architectural-mutation-testing.service";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: Request) {
  try {
    console.log("[MutationAPI] Initiating proactive architectural probing...");
    const probeResults = await ArchitecturalMutationTesting.probeOptimalPatterns();
    
    const viableMutations = probeResults.filter(r => r.outcome === "VIABLE");
    
    return NextResponse.json({
      status: "probing_complete",
      total_tests: probeResults.length,
      viable_count: viableMutations.length,
      results: probeResults,
      recommendation: viableMutations.length > 0 ? "Trigger /api/evolution/evolve for best patterns" : "Wait for next cycle"
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
