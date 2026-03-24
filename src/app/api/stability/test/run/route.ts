
import { NextResponse } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FailureSurvivalAgent, GovernanceStressAgent } from "@/lib/services/stability";

export async function POST(request: Request) {
  const { test_type } = await request.json();
  console.log(`[StabilityAPI] Running ${test_type} drill...`);
  
  if (test_type === "survival") {
    const result = await FailureSurvivalAgent.run({ focus: "api_outage" });
    return NextResponse.json(result);
  }
  
  return NextResponse.json({ status: "initiated", test_type });
}
