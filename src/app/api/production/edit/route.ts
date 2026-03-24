import { NextResponse } from "next/server"
import { SocialEditorService } from "@/lib/production/social-editor.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new SocialEditorService()

    if (body.mode === "edit") {
      const result = await service.editDraft(body.id)
      return NextResponse.json({ status: "success", result })
    }

    const result = await service.sendToProduction(body.id, body.platform ?? "youtube")
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