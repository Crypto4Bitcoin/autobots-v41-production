
import { NextResponse } from "next/server"
import { IntentRegistryV2 } from "@/lib/services/intent-registry-v2.service"

export async function GET() {
  console.log("[API/Strategic/Intent] GET requested");
  try {
    const registry = new IntentRegistryV2()
    const intents = await registry.list()
    console.log("[API/Strategic/Intent] Success:", intents.length, "intents found");
    return NextResponse.json({ status: "success", intents })
  } catch (error) {
    console.error("[API/Strategic/Intent] Error:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
