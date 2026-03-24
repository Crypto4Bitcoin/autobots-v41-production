
import { NextResponse } from "next/server";
import { FederatedSovereigntyManager } from "@/lib/services/planetary/sovereignty.service";

export async function POST(request: Request) {
  const { data_id, from_region, to_region } = await request.json();
  const result = await FederatedSovereigntyManager.validateTransfer(data_id, from_region, to_region);
  return NextResponse.json(result);
}
