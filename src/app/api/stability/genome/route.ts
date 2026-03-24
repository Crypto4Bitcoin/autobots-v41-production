
import { NextResponse } from "next/server";
import { GenomeService } from "@/lib/services/genome";

export async function GET() {
  const genome = GenomeService.getGenome();
  return NextResponse.json({ genome });
}
