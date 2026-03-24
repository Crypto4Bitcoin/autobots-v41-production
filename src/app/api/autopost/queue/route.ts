import { NextResponse } from "next/server"
import { AutoPosterService } from "@/lib/autopost/autoposter.service"

export async function POST() {
  try {
    const service = new AutoPosterService()
    const result = await service.queueAllReady()
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