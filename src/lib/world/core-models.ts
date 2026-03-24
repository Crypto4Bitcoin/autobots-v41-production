
import { DistrictType, AgentStatus } from './types';

// ==========================================
// CORE DATA MODELS (PHASE 14)
// ==========================================

export interface AgentProfile {
  id: string;             // UUID
  name: string;           // Derived from job, e.g., 'HVAC Prime'
  role: string;           // The specific job type
  district: DistrictType; // The physical/logical node they exist in
  level: number;          // Evolution level (1-99)
  money: number;          // Accumulated task contract payouts
  status: AgentStatus;    // idle | working | paused | alert
  x: number;              // Position X on canvas (0-100)
  y: number;              // Position Y on canvas (0-100)
  
  // Tracking History
  completedTasks: number;
  totalTaxesPaid: number;
  lastActiveAt: number;   // Timestamp
}

export type TaskStatus = 'open' | 'assigned' | 'in_progress' | 'completed' | 'failed' | 'audited';

export interface TaskContract {
  id: string;
  title: string;          // e.g., 'Verify HVAC Diagram V3'
  requiredRole: string;   // e.g., 'HVAC'
  district: DistrictType; // Where the task originated
  payoutAmount: number;   // The symbolic value rewarded to the agent
  taxAmount: number;      // The amount captured by the IRS
  status: TaskStatus;
  
  assignedAgentId?: string;
  createdAt: number;
  completedAt?: number;
}

export interface RevenueEvent {
  id: string;
  agentId: string;
  taskId: string;
  district: DistrictType;
  amount: number;
  timestamp: number;
}

export interface TaxEvent {
  id: string;
  agentId: string;
  taskId: string;
  amount: number;          // Absorbed by global treasury
  timestamp: number;
}

export interface LevelEvent {
  id: string;
  agentId: string;
  previousLevel: number;
  newLevel: number;
  trigger: 'task_threshold' | 'evolution_chamber';
  timestamp: number;
}

export interface GovernanceCase {
  id: string;
  agentId: string;
  reason: string;
  severity: 'low' | 'medium' | 'high' | 'jail';
  resolutionStatus: 'open' | 'investigating' | 'resolved';
  timestamp: number;
}
