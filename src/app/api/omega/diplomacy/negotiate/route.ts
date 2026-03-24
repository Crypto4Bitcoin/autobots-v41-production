import { NextResponse } from "next/server"
import { DiplomaticNegotiationEngine } from "@/lib/services/omega/diplomatic-negotiation-engine.service"
import { AgreementStandardizationService } from "@/lib/services/omega/agreement-standardization.service"

export async function POST(req: Request) {
  try {
    const { resource, parties, terms } = await req.json()
    const engine = new DiplomaticNegotiationEngine()
    const formalizer = new AgreementStandardizationService()

    const negoId = await engine.start(resource, parties)
    await engine.propose(negoId, terms)
    await engine.finalize(negoId)
    
    const agreement = await formalizer.formalize(negoId, terms)
    
    return NextResponse.json({ status: "success", negoId, agreement })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Negotiation failed" }, { status: 500 })
  }
}