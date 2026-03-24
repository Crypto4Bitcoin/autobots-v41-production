import { NextResponse } from "next/server"
import { TrustVerificationMesh } from "@/lib/services/omega/trust-verification-mesh.service"

export async function POST(req: Request) {
  try {
    const { from, to, score } = await req.json()
    const mesh = new TrustVerificationMesh()
    await mesh.establishTrust(from, to, score)
    const currentScore = await mesh.getTrustScore(from, to)
    return NextResponse.json({ status: "success", from, to, score: currentScore })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Trust mesh update failed" }, { status: 500 })
  }
}