
import { NextResponse } from "next/server";
import { StrategicSimService } from "@/lib/services/control/strategy_v2.service";

export async function POST(request: Request) {
  const { scenario_id } = await request.json();
  const result = await StrategicSimService.rehearse(scenario_id);
  return NextResponse.json(result);
}
