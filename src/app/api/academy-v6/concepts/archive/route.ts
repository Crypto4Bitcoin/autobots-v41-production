
import { NextResponse } from "next/server"
import { ConceptArchiveService } from "@/lib/academy-v6/concept-archive.service"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bucket = url.searchParams.get("bucket") as any
    const list = ConceptArchiveService.list(bucket)
    return NextResponse.json({ status: "success", list })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
