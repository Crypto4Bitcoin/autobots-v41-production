import { NextResponse } from "next/server"
import { ReputationSystemService } from "@/lib/academy-v11/reputation-system.service"

export async function POST() {
  try {
    const service = new ReputationSystemService()
    const result = await service.run()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json({ status: "error", message: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
