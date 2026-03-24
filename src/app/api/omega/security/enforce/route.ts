import { NextResponse } from "next/server"
import { AdversarialDefenseTeam } from "@/lib/omega/security/adversarial-defense-team.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const team = new AdversarialDefenseTeam()
    const result = await team.enforce({
      target: body?.target ?? "unknown",
      findings: body?.findings ?? [],
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
