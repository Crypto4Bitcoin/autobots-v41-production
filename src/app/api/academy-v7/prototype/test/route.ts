import { NextResponse } from "next/server"
import { PrototypePlannerService } from "@/lib/academy-v7/prototype-planner.service"
import { PrototypeSandboxService } from "@/lib/academy-v7/prototype-sandbox.service"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const planner = new PrototypePlannerService()
    const sandbox = new PrototypeSandboxService()
    const plan = await planner.plan(body)
    const result = await sandbox.test(plan)
    return NextResponse.json({ status: "success", plan, result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
