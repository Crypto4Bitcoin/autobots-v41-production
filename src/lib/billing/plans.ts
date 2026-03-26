export const billingPlans = [
  { code: 'starter', name: 'Starter', monthlyPriceCents: 5000, agentLimit: 1 },
  { code: 'growth', name: 'Growth', monthlyPriceCents: 15000, agentLimit: 3 },
  { code: 'enterprise', name: 'Enterprise', monthlyPriceCents: 50000, agentLimit: 20 },
] as const;
