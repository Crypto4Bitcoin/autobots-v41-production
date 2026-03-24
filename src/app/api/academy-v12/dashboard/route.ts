import { NextResponse } from "next/server"
import { ConstitutionalStoreService } from "@/lib/academy-v12/constitutional-store.service"

export async function GET() {
  try {
    return NextResponse.json({
      status: "success",
      result: {
        generatedAt: new Date().toISOString(),
        principles: ConstitutionalStoreService.listPrinciples(),
        impacts: ConstitutionalStoreService.listImpacts(),
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
