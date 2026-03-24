
import { NextResponse } from "next/server";
import { STABILITY_DATABASE } from "@/lib/constants/stability-data";

export async function GET() {
  return NextResponse.json({
    global_resilience_score: 0.91,
    domains: STABILITY_DATABASE.scores,
    timestamp: new Date().toISOString()
  });
}
