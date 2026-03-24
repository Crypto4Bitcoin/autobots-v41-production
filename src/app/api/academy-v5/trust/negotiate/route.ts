
import { NextResponse } from "next/server"
import { TrustTierRegistryService } from "@/lib/academy-v5/trust-tier-registry.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const svc = new TrustTierRegistryService()
    const result = await svc.negotiate(body)
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: String(error) }, { status: 500 })
  }
}
