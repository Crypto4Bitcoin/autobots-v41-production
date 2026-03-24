
import { NextResponse } from "next/server";
import { ConstitutionalRegistryService } from "@/lib/services/constitution";

export async function GET() {
  const constitution = ConstitutionalRegistryService.getConstitution();
  return NextResponse.json({ constitution });
}
