export interface RevenueRecord {
  id: string
  productId: string
  schoolId: string
  revenue: number
  cost: number
  period: string
  createdAt: string
}

export interface AllocationRecord {
  id: string
  target: string
  allocationScore: number
  recommendation: "increase" | "hold" | "decrease"
  createdAt: string
}

export const AllocationRecord = {} as any;

export const RevenueRecord = {} as any;
