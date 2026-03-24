
import { NextResponse } from "next/server";
import { CrossPlanetaryRoutingEngine } from "@/lib/services/planetary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { workload_id, constraints } = body;
    const result = await CrossPlanetaryRoutingEngine.routeWorkload(workload_id, constraints);
    console.log("[API/Planetary/Route] Final Result:", result);
    return NextResponse.json(result || { error: "No result" });
  } catch (err: unknown) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
