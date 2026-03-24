
import { NextResponse } from "next/server";
import { ResearchService } from "@/lib/services/research";

export async function GET() {
  const hypotheses = ResearchService.getHypotheses();
  return NextResponse.json({ hypotheses });
}

export async function POST(request: Request) {
  const body = await request.json();
  const hyp = ResearchService.proposeHypothesis(body);
  return NextResponse.json(hyp);
}
