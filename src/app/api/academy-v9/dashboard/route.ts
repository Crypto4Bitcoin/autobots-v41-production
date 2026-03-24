import { NextResponse } from "next/server"
import { RevenueStoreService } from "@/lib/academy-v9/revenue-store.service"

export async function GET() {
  try {
    return NextResponse.json({
      status: "success",
      result: {
        generatedAt: new Date().toISOString(),
        revenueCount: RevenueStoreService.getRevenue().length,
        allocations: RevenueStoreService.getAllocations(),
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
