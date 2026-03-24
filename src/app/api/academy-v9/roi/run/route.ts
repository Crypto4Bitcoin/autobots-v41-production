import { NextResponse } from "next/server"
import { ProductRoiService } from "@/lib/academy-v9/product-roi.service"

export async function POST() {
  try {
    const service = new ProductRoiService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
