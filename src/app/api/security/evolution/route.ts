import { NextResponse } from "next/server"
import { MutationIntegrityChecker } from "@/lib/services/security/mutation-integrity.service"
import { EvolutionScopeLimiter } from "@/lib/services/security/evolution-limiter.service"

export async function POST(req: Request) {
  try {
    const mutation = await req.json()
    const checker = new MutationIntegrityChecker()
    const limiter = new EvolutionScopeLimiter()

    const verified = await checker.verifyMutation(mutation)
    const inScope = await limiter.checkScope(mutation)

    if (!verified || !inScope) {
      return NextResponse.json({ status: "rejected", reason: !verified ? "integrity_fail" : "out_of_scope" }, { status: 403 })
    }

    return NextResponse.json({ status: "accepted", mutationId: mutation.id })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Evolution gatekeeper error" }, { status: 500 })
  }
}