import { NextResponse } from "next/server"
import { StrategicForesightTeam } from "@/lib/omega/foresight/strategic-foresight-team.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const team = new StrategicForesightTeam()
    const result = await team.predict({
      horizon: body?.horizon ?? "medium",
      signals: body?.signals ?? [],
    })

    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
