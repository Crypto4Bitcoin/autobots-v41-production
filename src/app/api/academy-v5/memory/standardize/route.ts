
import { NextResponse } from "next/server"
import { GlobalMemoryStandardsService } from "@/lib/academy-v5/global-memory-standards.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const svc = new GlobalMemoryStandardsService()
    const result = await svc.standardize(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
