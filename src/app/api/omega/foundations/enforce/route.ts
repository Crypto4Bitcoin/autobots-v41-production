import { NextResponse } from "next/server"
import { FoundationIntegrityTeam } from "@/lib/omega/foundations/foundation-integrity-team.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const team = new FoundationIntegrityTeam()
    const decision = await team.enforce({
      id: body?.id ?? crypto.randomUUID(),
      domain: body?.domain ?? "reliability",
      type: body?.type ?? "unknown",
      severity: body?.severity ?? "low",
      detail: body?.detail ?? "",
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ status: "success", decision })
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
