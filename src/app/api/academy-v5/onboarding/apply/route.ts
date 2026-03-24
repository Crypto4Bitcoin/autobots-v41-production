
import { NextResponse } from "next/server"
import { PartnerSchoolOnboardingService } from "@/lib/academy-v5/partner-school-onboarding.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const svc = new PartnerSchoolOnboardingService()
    const result = await svc.apply(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}

export async function GET() {
  const svc = new PartnerSchoolOnboardingService()
  const list = await svc.list()
  return NextResponse.json({ status: "success", list })
}
