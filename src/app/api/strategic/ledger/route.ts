
import { NextResponse } from "next/server"
import { UnifiedDecisionLedger } from "@/lib/services/unified-decision-ledger.service"

const ledger = new UnifiedDecisionLedger()

export async function GET() {
  console.log("[API/Strategic/Ledger] GET requested");
  try {
    const entries = await ledger.list()
    console.log("[API/Strategic/Ledger] Success:", entries.length, "entries found");
    return NextResponse.json({ status: "success", entries })
  } catch (error) {
    console.error("[API/Strategic/Ledger] Error:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function POST() {
  console.log("[API/Strategic/Ledger] POST requested");
  try {
    // Ensuring crypto is available
    const uuid = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const entry = await ledger.record({
      id: uuid,
      type: "routing",
      payload: { note: "Sample routing decision entry" },
      createdAt: new Date().toISOString(),
    })
    console.log("[API/Strategic/Ledger] Recorded entry:", entry.id);
    return NextResponse.json({ status: "success", entry })
  } catch (error) {
    console.error("[API/Strategic/Ledger] Error:", error);
    return NextResponse.json(
      { status: "error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
