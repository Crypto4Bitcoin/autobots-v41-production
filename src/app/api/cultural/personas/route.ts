
import { NextResponse } from "next/server";
import { CulturalContextService } from "@/lib/services/cultural";

export async function GET() {
  const personas = CulturalContextService.getPersonas();
  return NextResponse.json({ personas });
}
