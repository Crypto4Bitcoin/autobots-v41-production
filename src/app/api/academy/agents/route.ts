import { NextResponse } from "next/server"
import { AcademyRegistryService } from "@/lib/academy/academy-registry.service"

export async function GET() {
  return NextResponse.json({
    status: "success",
    agents: AcademyRegistryService.getAllAgents(),
  })
}