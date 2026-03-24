import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  console.log("[API] Creating Workflow Mission:", body);
  return NextResponse.json({ 
    status: "success", 
    message: "Workflow mission initialized.",
    runId: "wf-" + Math.random().toString(36).substring(2, 9)
  });
}
