import { NextResponse } from "next/server"
import { SecurityContainmentController } from "@/lib/services/security/containment-controller.service"

export async function POST(req: Request) {
  try {
    const { targetId, type } = await req.json()
    const controller = new SecurityContainmentController()
    await controller.isolate(targetId, type)
    return NextResponse.json({ status: "contained", targetId, type })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Containment failed" }, { status: 500 })
  }
}