export interface StrategicIntent {
  id: string
  name: string
  version: number
  priority: number
  description: string
  active: boolean
  createdAt: string
}

export class IntentRegistryV2 {
  private intents: StrategicIntent[] = [
    {
      id: "intent-legibility",
      name: "Legibility",
      version: 2,
      priority: 10,
      description: "Operators must understand what the system is doing.",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "intent-sovereignty",
      name: "Sovereignty",
      version: 2,
      priority: 10,
      description: "Human and institutional override authority must remain enforceable.",
      active: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "intent-stability",
      name: "Stability",
      version: 2,
      priority: 10,
      description: "System changes must preserve long-term resilience.",
      active: true,
      createdAt: new Date().toISOString(),
    },
  ]

  async list(): Promise<StrategicIntent[]> {
    return this.intents
  }

  async add(intent: StrategicIntent): Promise<StrategicIntent> {
    this.intents.push(intent)
    return intent
  }
}