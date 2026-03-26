import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ 
    status: "healthy", 
    state: "SOVEREIGN_IDLE",
    version: "4.0.0",
    timestamp: new Date().toISOString() 
  });
}
