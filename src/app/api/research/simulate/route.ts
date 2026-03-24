
import { NextResponse } from "next/server";
import { ArchitectureEvolutionEngine } from "@/lib/services/research/research.service";

export async function POST(request: Request) {
  const { hypothesis_id } = await request.json();
  const result = await ArchitectureEvolutionEngine.runSimulation(hypothesis_id);
  return NextResponse.json(result);
}
