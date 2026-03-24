
import { NextResponse } from "next/server"
import { CrossSchoolAutopostService } from "@/lib/academy-v5/cross-school-autopost.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const svc = new CrossSchoolAutopostService()
    const result = await svc.coordinate(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
