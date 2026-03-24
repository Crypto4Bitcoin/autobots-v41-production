
import { NextResponse } from "next/server"
import { ConceptArchiveService } from "@/lib/academy-v6/concept-archive.service"

export async function GET() {
  try {
    const good = ConceptArchiveService.list("good_working")
    const bad = ConceptArchiveService.list("bad_not_working")
    return NextResponse.json({
      status: "success",
      result: {
        goodCount: good.length,
        badCount: bad.length,
        recentGood: good.slice(0, 5),
        recentBad: bad.slice(0, 5),
      }
    })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
