import { NextResponse } from "next/server"
import { TeacherWebSearchService } from "@/lib/search/teacher-web-search.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const query = String(body?.query ?? "")
    const service = new TeacherWebSearchService()
    const results = await service.search(query)

    return NextResponse.json({ status: "success", results })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}