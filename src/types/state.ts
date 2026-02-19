// src/types/state.ts
export type TransactionType = 
  | 'WORKSPACE_CHANGE'
  | 'FILE_UPDATE'
  | 'AGENT_SELECT'
  | 'MEMORY_CREATE'
  | 'GENERATION_START'
  | 'GENERATION_COMPLETE'
  | 'ERROR'
  | 'USER_ACTION';

export interface StateTransaction<T = any> {
  id: string;
  type: TransactionType;
  component: string;
  before: T | null;
  after: T | null;
  timestamp: number;
  duration?: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface StateSnapshot {
  id: string;
  timestamp: number;
  state: Record<string, any>;
  transactions: StateTransaction[];
}

export interface StateValidationResult {
  valid: boolean;
  errors: Array<{
    path: string;
    expected: any;
    received: any;
    message: string;
  }>;
}
