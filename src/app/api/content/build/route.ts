import { NextResponse } from "next/server"
import { SocialContentFactoryService } from "@/lib/content-factory/social-content-factory.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new SocialContentFactoryService()
    const result = await service.buildFromCategory(body.category)
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