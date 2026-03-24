import { NextResponse } from "next/server";
import { CreatorAgent } from "@/lib/services/media/creatoragent.service";

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    const result = await CreatorAgent.handleCommand(command);
    return NextResponse.json(result);
  } catch (error) {
    console.error("CreatorAgent Error:", error);
    return NextResponse.json({ status: "error", message: "Creation failed" }, { status: 500 });
  }
}
