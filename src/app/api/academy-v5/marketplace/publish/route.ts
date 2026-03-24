
import { NextResponse } from "next/server"
import { CurriculumMarketplaceService } from "@/lib/academy-v5/curriculum-marketplace.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const svc = new CurriculumMarketplaceService()
    const result = await svc.publish(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
