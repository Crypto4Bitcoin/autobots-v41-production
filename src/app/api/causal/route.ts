
import { NextResponse } from "next/server";
import { CausalGraphService } from "@/lib/services/causal";

export async function GET() {
  const graph = CausalGraphService.getGraph();
  return NextResponse.json({ graph });
}
