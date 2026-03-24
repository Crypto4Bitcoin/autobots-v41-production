
import { NextResponse } from "next/server"
import { ConceptTestService } from "@/lib/academy-v6/concept-test.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new ConceptTestService()
    const result = await service.test(body.concept, body.review, body.analytics)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
