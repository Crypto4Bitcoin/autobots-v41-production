import { NextResponse } from "next/server"
import { ProductReadinessService } from "@/lib/academy-v8/product-readiness.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new ProductReadinessService()
    const result = await service.score(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
