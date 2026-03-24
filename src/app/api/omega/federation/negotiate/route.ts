import { NextResponse } from "next/server"
import { FederationStewardshipTeam } from "@/lib/omega/federation/federation-stewardship-team.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const team = new FederationStewardshipTeam()
    const result = await team.negotiate({
      proposalId: body?.proposalId ?? crypto.randomUUID(),
      sourceOrg: body?.sourceOrg ?? "org-a",
      targetOrg: body?.targetOrg ?? "org-b",
      scope: body?.scope ?? [],
      trustLevel: body?.trustLevel ?? "limited",
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
