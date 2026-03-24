import { NextResponse } from "next/server"
import { VerifyAgentService } from "@/lib/academy/verify-agent.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new VerifyAgentService()

    if (body?.stage === "memory") {
      return NextResponse.json({
        status: "success",
        result: await service.verifyMemoryRecord(body.id),
      })
    }

    if (body?.stage === "social_memory") {
      return NextResponse.json({
        status: "success",
        result: await service.verifySocialMemory(body.id),
      })
    }

    if (body?.stage === "production") {
      return NextResponse.json({
        status: "success",
        result: await service.verifyProductionRecord(body.id),
      })
    }

    return NextResponse.json(
      { status: "error", message: "Unsupported verification stage" },
      { status: 400 }
    )
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