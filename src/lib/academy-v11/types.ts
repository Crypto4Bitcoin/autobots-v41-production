export interface CommonsShareRecord {
  id: string
  source: string
  target: string
  assetType: string
  title: string
  createdAt: string
}

export interface ReputationRecord {
  id: string
  schoolId: string
  score: number
  createdAt: string
}

export const CommonsShareRecord = {} as any;

export const ReputationRecord = {} as any;
