
import { NextResponse } from "next/server";
import { StrategicSimService } from "@/lib/services/control/strategy_v2.service";

export async function GET() {
  const scenarios = StrategicSimService.getScenarios();
  return NextResponse.json({ scenarios });
}
