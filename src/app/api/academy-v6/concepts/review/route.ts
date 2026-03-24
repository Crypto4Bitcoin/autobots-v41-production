
import { NextResponse } from "next/server"
import { ConceptReviewService } from "@/lib/academy-v6/concept-review.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const service = new ConceptReviewService()
    const result = await service.review(body.concept)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
