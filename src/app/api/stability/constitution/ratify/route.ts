
import { NextResponse } from "next/server";
import { ConstitutionalRegistryService } from "@/lib/services/constitution";
import { GenomeService } from "@/lib/services/genome";

export async function POST(request: Request) {
  const { gene_id } = await request.json();
  const genome = GenomeService.getGenome();
  const gene = genome.find(g => g.gene_id === gene_id);
  
  if (gene) {
    const principle = ConstitutionalRegistryService.ratifyGene(gene);
    return NextResponse.json(principle);
  }
  
  return NextResponse.json({ error: "Gene not found" }, { status: 404 });
}
