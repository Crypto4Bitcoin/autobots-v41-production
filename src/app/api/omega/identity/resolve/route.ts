import { NextResponse } from "next/server"
import { SovereignIdentityGateway } from "@/lib/services/omega/sovereign-identity-gateway.service"

export async function POST(req: Request) {
  try {
    const { did } = await req.json()
    const gateway = new SovereignIdentityGateway()
    // Mock profile for demo
    await gateway.register({ did: "did:autobots:alpha", owner: "AutoBots-Alpha", publicKey: "pub-123", claims: { role: "steward" } })
    const profile = await gateway.resolve(did)
    return NextResponse.json({ status: "success", profile })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "DID resolution failed" }, { status: 500 })
  }
}