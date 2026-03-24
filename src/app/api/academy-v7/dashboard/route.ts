import { NextResponse } from "next/server"
import { PrototypeArchiveService } from "@/lib/academy-v7/prototype-archive.service"

export async function GET() {
  try {
    const rows = PrototypeArchiveService.list()
    return NextResponse.json({
      status: "success",
      result: {
        generatedAt: new Date().toISOString(),
        count: rows.length,
        readyForMarketplace: rows.filter((x) => x.score.stage === "prototype_ready_for_marketplace").length,
        validated: rows.filter((x) => x.score.stage === "prototype_validated").length,
        rejected: rows.filter((x) => x.score.stage === "prototype_rejected").length,
        rows: rows.slice(0, 20),
      },
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
