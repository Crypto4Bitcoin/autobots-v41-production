import { NextResponse } from "next/server"
import { VentureStoreService } from "@/lib/academy-v10/venture-store.service"

export async function GET() {
  try {
    const ventures = VentureStoreService.list()
    return NextResponse.json({
      status: "success",
      result: {
        generatedAt: new Date().toISOString(),
        count: ventures.length,
        rows: ventures,
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
