import { NextResponse } from "next/server"
import { AcademyLiveGovernanceTeamService } from "@/lib/academy/academy-live-governance-team.service"

export async function POST() {
  try {
    const service = new AcademyLiveGovernanceTeamService()
    const result = await service.startSchool()
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