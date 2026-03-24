export interface VentureRecord {
  id: string
  name: string
  products: string[]
  status: "active" | "scaling" | "watch" | "shutdown"
  strategyScore: number
  createdAt: string
}

export const VentureRecord = {} as any;
