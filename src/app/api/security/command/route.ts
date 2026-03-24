import { NextResponse } from "next/server"
import { CommandSanitizer } from "@/lib/services/security/command-sanitizer.service"
import { RiskScoringEngine } from "@/lib/services/security/risk-scoring-engine.service"

export async function POST(req: Request) {
  try {
    const { command } = await req.json()
    const sanitizer = new CommandSanitizer()
    const risk = new RiskScoringEngine()

    const cleanCommand = sanitizer.sanitize(command)
    const score = await risk.score({ command: cleanCommand })

    return NextResponse.json({ status: "success", command: cleanCommand, riskScore: score })
  } catch (error) {
    return NextResponse.json({ status: "violation", message: error instanceof Error ? error.message : "Command rejected" }, { status: 403 })
  }
}