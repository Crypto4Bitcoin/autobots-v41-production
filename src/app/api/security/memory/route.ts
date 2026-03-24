import { NextResponse } from "next/server"
import { MemoryGuard } from "@/lib/services/security/memory-guard.service"
import { PoisonDetector } from "@/lib/services/security/poison-detector.service"

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const guard = new MemoryGuard()
    const detector = new PoisonDetector()

    const valid = await guard.validateWrite(data)
    const poisoned = await detector.isPoisoned(data)

    if (!valid || poisoned) {
      return NextResponse.json({ status: "blocked", reason: poisoned ? "poisoned" : "policy_violation" }, { status: 403 })
    }

    return NextResponse.json({ status: "success", received: true })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Memory write failed" }, { status: 500 })
  }
}