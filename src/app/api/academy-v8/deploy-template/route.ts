import { NextResponse } from "next/server"
import { DeploymentTemplateService } from "@/lib/academy-v8/deployment-template.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new DeploymentTemplateService()
    const result = await service.buildTemplate(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
