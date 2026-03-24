import { NextResponse } from "next/server"
import { AdversarialPatternDetector } from "@/lib/services/security/adversarial-detector.service"

export async function POST(req: Request) {
  try {
    const behavior = await req.json()
    const detector = new AdversarialPatternDetector()
    const detected = await detector.detect(behavior)
    return NextResponse.json({ status: "success", detected, behavior: behavior.type })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Detection failed" }, { status: 500 })
  }
}