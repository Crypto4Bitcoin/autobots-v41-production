
import { NextResponse } from "next/server";
import { NonNegotiableAnalyzer, ViolationContainmentController } from "@/lib/services/constitution/enforcement.service";

export async function POST(request: Request) {
  const body = await request.json();
  const analysis = await NonNegotiableAnalyzer.analyze(body);
  
  if (analysis.status === "violation") {
    const containment = await ViolationContainmentController.contain(analysis.violations[0]);
    return NextResponse.json({ analysis, containment });
  }
  
  return NextResponse.json({ analysis });
}
