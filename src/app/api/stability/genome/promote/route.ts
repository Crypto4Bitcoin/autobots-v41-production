
import { NextResponse } from "next/server";
import { GenomeService } from "@/lib/services/genome";

export async function POST(request: Request) {
  const { gene_id } = await request.json();
  const promoted = GenomeService.promoteGene(gene_id);
  if (promoted) return NextResponse.json(promoted);
  return NextResponse.json({ error: "Gene not found" }, { status: 404 });
}
