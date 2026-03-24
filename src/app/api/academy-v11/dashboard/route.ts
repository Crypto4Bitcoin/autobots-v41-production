import { NextResponse } from "next/server"
import { CommonsStoreService } from "@/lib/academy-v11/commons-store.service"

export async function GET() {
  try {
    return NextResponse.json({
      status: "success",
      result: {
        generatedAt: new Date().toISOString(),
        shares: CommonsStoreService.listShares(),
        reputations: CommonsStoreService.listReputations(),
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
