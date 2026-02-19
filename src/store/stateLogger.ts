// src/store/stateLogger.ts
import { StateTransaction, TransactionType } from '@/types/state';

let transactionId = 0;
let sessionId = crypto.randomUUID?.() || Date.now().toString();
const transactionLog: StateTransaction[] = [];
const MAX_LOG_SIZE = 1000;
const marks = new Map<string, number>();

export const stateLogger = {
  begin: (type: TransactionType, component: string, metadata?: Record<string, any>) => {
    const id = `${Date.now()}-${++transactionId}`;
    marks.set(id, performance.now());
    return {
      id, type, component, metadata,
      end: <T>(before: T | null, after: T | null) => {
        const startTime = marks.get(id) || performance.now();
        const duration = performance.now() - startTime;
        marks.delete(id);
        const transaction: StateTransaction<T> = {
          id, type, component, before, after,
          timestamp: Date.now(), duration, sessionId, metadata
        };
        transactionLog.unshift(transaction as StateTransaction);
        if (transactionLog.length > MAX_LOG_SIZE) transactionLog.pop();
        if (process.env.NODE_ENV === 'development') {
          console.group(`🔄 ${type} (${duration.toFixed(2)}ms)`);
          console.log('Component:', component);
          console.log('Before:', before);
          console.log('After:', after);
          if (metadata) console.log('Metadata:', metadata);
          console.groupEnd();
        }
        return transaction;
      }
    };
  },
  log: (type: TransactionType, component: string, metadata?: Record<string, any>) => {
    const transaction: StateTransaction = {
      id: `${Date.now()}-${++transactionId}`, type, component,
      before: null, after: null, timestamp: Date.now(), sessionId, metadata
    };
    transactionLog.unshift(transaction);
    if (transactionLog.length > MAX_LOG_SIZE) transactionLog.pop();
    if (process.env.NODE_ENV === 'development') {
      console.log(`📋 ${type} from ${component}`, metadata || '');
    }
    return transaction;
  },
  getRecent: (limit: number = 50) => transactionLog.slice(0, limit),
  getByType: (type: TransactionType) => transactionLog.filter(t => t.type === type),
  getByComponent: (component: string) => transactionLog.filter(t => t.component === component),
  clear: () => { transactionLog.length = 0; marks.clear(); },
  export: () => [...transactionLog]
};

if (typeof window !== 'undefined') {
  (window as any).__STATE_LOGGER__ = stateLogger;
}
