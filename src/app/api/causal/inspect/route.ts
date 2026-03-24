
import { NextResponse } from "next/server";
import { CausalGraphService, SystemNarrativeGenerator } from "@/lib/services/causal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  
  const chain = CausalGraphService.reconstructChain(id);
  const narrative = SystemNarrativeGenerator.generate(chain);
  
  return NextResponse.json({ chain, narrative });
}
