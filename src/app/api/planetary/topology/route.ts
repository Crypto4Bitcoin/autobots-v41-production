
import { NextResponse } from "next/server";
import { GlobalTopologyService } from "@/lib/services/planetary";

export async function GET() {
  const topology = GlobalTopologyService.getTopology();
  return NextResponse.json({ topology });
}
