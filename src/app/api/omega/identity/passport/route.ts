import { NextResponse } from "next/server"
import { FederatedPassportService } from "@/lib/services/omega/federated-passport.service"

export async function POST(req: Request) {
  try {
    const { issuerId, subjectDid, scopes } = await req.json()
    const service = new FederatedPassportService()
    const passport = await service.issue(issuerId, subjectDid, scopes)
    return NextResponse.json({ status: "success", passport })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Passport issuance failed" }, { status: 500 })
  }
}