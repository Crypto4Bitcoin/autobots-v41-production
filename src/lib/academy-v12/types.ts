export interface PrincipleRecord {
  id: string
  title: string
  description: string
  weight: number
  createdAt: string
}

export interface ImpactRecord {
  id: string
  domain: string
  score: number
  period: string
  createdAt: string
}

export const ImpactRecord = {} as any;

export const PrincipleRecord = {} as any;
