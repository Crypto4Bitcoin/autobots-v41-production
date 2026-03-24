export interface TrafficLog {
  source: string
  target: string
  timestamp: string
}

export class RuntimeFirewall {
  private rules = new Set<string>()

  allow(source: string, target: string): void {
    this.rules.add(`${source}->${target}`)
  }

  check(source: string, target: string): boolean {
    return this.rules.has(`${source}->${target}`)
  }
}