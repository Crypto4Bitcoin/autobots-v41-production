export type DomainStatus = "idle" | "active" | "warning" | "error" | "locked";

export type DomainMetric = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "flat";
};

export type DomainCase = {
  id: string;
  title: string;
  status: string;
  priority?: "low" | "medium" | "high" | "critical";
  createdAt: string;
  updatedAt?: string;
};

export type DomainEvent = {
  id: string;
  type: string;
  domain: string;
  message: string;
  timestamp: string;
  actor?: string;
  meta?: Record<string, unknown>;
};

export type DomainContract = {
  domainId: string;
  title: string;
  theme: "emerald" | "indigo" | "violet" | "amber" | "slate" | "gold" | "crimson";
  status: DomainStatus;
  metrics: DomainMetric[];
  cases: DomainCase[];
  events: DomainEvent[];
  lastUpdated: string | null;
};

export type GlobalLogEvent = {
  id: string;
  domain: string;
  action: string;
  status: "started" | "success" | "failed";
  timestamp: string;
  actor?: string;
  payload?: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
};

/**
 * Lightweight Runtime Validator for Contracts
 * Ensures the adapter output is not "typed but wrong"
 */
export function validateContract(contract: DomainContract): DomainContract {
    if (!Array.isArray(contract.metrics)) throw new Error(`CONTRACT_ERROR: [${contract.domainId}] metrics must be an array`);
    if (!Array.isArray(contract.cases)) throw new Error(`CONTRACT_ERROR: [${contract.domainId}] cases must be an array`);
    if (!contract.status) throw new Error(`CONTRACT_ERROR: [${contract.domainId}] status is required`);
    
    // Defaulting missing fields for soft stability
    return {
        ...contract,
        metrics: contract.metrics || [],
        cases: contract.cases || [],
        events: contract.events || [],
        lastUpdated: contract.lastUpdated || new Date().toISOString()
    };
}
