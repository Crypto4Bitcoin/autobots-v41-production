import { NextResponse } from "next/server"
import { CodeGraphService } from "@/lib/services/reliability/code-graph.service"
import { ImportSentinelAgent } from "@/lib/services/reliability/import-sentinel.service"

export async function POST(req: Request) {
  try {
    const { filePath, content } = await req.json()
    const graph = new CodeGraphService()
    const sentinel = new ImportSentinelAgent()

    const node = await graph.scanFile(filePath, content)
    
    // Simulate finding a missing component
    if (content.includes("@/components/ui/badge") && !fs.existsSync(path.join(process.cwd(), "src/components/ui/badge.tsx"))) {
       await sentinel.raiseIncident(filePath, "@/components/ui/badge", "missing")
    }

    return NextResponse.json({ 
      status: "success", 
      node, 
      incidents: sentinel.getActiveIncidents() 
    })
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ status: "error", message: "Scan failed" }, { status: 500 })
  }
}