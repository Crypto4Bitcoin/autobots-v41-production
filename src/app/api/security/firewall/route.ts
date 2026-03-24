import { NextResponse } from "next/server"
import { RuntimeFirewall } from "@/lib/services/security/runtime-firewall.service"

export async function POST(req: Request) {
  try {
    const { source, target } = await req.json()
    const firewall = new RuntimeFirewall()
    firewall.allow("agent-alpha", "memory-service")
    const allowed = firewall.check(source, target)
    return NextResponse.json({ status: "success", allowed, source, target })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Firewall check failed" }, { status: 500 })
  }
}