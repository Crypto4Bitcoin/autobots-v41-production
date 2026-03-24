import { NextResponse } from "next/server"
import { IdentityAuthorityService } from "@/lib/services/security/identity-authority.service"

export async function POST(req: Request) {
  try {
    const { id } = await req.json()
    const authority = new IdentityAuthorityService()
    // Mock registration for demo
    await authority.register({ id: "agent-alpha", type: "agent", authorityScope: ["read", "write"], status: "active" })
    const valid = await authority.verify(id)
    return NextResponse.json({ status: "success", valid, id })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Security check failed" }, { status: 403 })
  }
}