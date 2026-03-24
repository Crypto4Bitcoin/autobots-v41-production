export interface Bid {
  agentId: string;
  amount: number;
  priority: number;
}
export function resolveBidding(bids: Bid[]): string | null {
  if (bids.length === 0) return null;
  // Item 112: Resource bidding system
  // Sort by weighted priority: (amount * 0.4) + (priority * 0.6)
  const sorted = [...bids].sort((a, b) => {
    const scoreA = (a.amount * 0.4) + (a.priority * 0.6);
    const scoreB = (b.amount * 0.4) + (b.priority * 0.6);
    return scoreB - scoreA;
  });
  return sorted[0].agentId;
}
