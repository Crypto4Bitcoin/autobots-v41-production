
import { NextResponse } from "next/server"
import { SchoolIdentityDidService } from "@/lib/academy-v5/school-identity-did.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const svc = new SchoolIdentityDidService()
    const result = await svc.issue(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
