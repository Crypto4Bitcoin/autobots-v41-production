
import { NextResponse } from "next/server";
import { InterfaceEmpathyEngine } from "@/lib/services/cultural";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { report, persona_id } = body;
    const adjusted = InterfaceEmpathyEngine.adaptNarrative(report, persona_id);
    return NextResponse.json({ adjusted });
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
