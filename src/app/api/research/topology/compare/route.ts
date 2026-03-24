
import { NextResponse } from "next/server";
import { ComparativeTopologySimulator } from "@/lib/services/research/topology.service";

export async function POST(request: Request) {
  const { topologyA, topologyB } = await request.json();
  const result = await ComparativeTopologySimulator.simulateTopology(topologyA, topologyB);
  return NextResponse.json(result);
}
