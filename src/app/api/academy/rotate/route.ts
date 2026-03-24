import { NextResponse } from "next/server"
import { PrincipalRotationService } from "@/lib/academy/principal-rotation.service"

export async function POST() {
  try {
    const service = new PrincipalRotationService()
    const result = await service.rotateHourly()
    return NextResponse.json({ status: "success", result })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}