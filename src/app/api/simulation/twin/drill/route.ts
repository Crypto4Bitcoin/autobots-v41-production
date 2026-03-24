import { NextResponse } from "next/server"
import { TwinDrillService } from "@/lib/services/twin/twin-drill.service"

export async function POST(request: Request) {
  try {
    const { type } = await request.json().catch(() => ({}));
    const service = new TwinDrillService()
    
    if (type === "omega_wave2_expanded") {
        return NextResponse.json({ status: "success", result: await service.runOmegaWave2Drill() });
    }

    return NextResponse.json({ status: "error", message: "Invalid drill type for current phase" }, { status: 400 });
  } catch (error) {
    console.error("Twin Drill Error:", error)
    return NextResponse.json(
      { status: "error", message: "Twin drill failed", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
