import { NextResponse } from "next/server"
import { TeacherResearchService } from "@/lib/academy/teacher-research.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new TeacherResearchService()
    const result = await service.performResearch(body.agentId)
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