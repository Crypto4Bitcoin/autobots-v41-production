export interface ResolutionIncident {
  id: string
  sourceFile: string
  targetModule: string
  type: "missing" | "case_mismatch" | "alias_error"
  timestamp: string
}

export class ImportSentinelAgent {
  private incidents: ResolutionIncident[] = []

  async raiseIncident(sourceFile: string, targetModule: string, type: ResolutionIncident["type"]): Promise<string> {
    const id = `incident-${Math.random().toString(36).substring(7)}`
    const incident: ResolutionIncident = {
      id,
      sourceFile,
      targetModule,
      type,
      timestamp: new Date().toISOString()
    }
    this.incidents.push(incident)
    return id
  }

  getActiveIncidents(): ResolutionIncident[] {
    return this.incidents
  }

  clearIncident(id: string): void {
    this.incidents = this.incidents.filter(i => i.id !== id)
  }
}