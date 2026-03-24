import { NextResponse } from "next/server"
import { RegionalContainmentController } from "@/lib/services/regional-containment-controller.service"

export async function POST() {
  try {
    const controller = new RegionalContainmentController()
    const result = await controller.apply({
      region: "us-east-1",
      mode: "contain",
      reason: "Regional instability detected.",
    })

    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}