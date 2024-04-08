import { AsyncLocalStorage } from 'async_hooks';

interface LogContext {
    traceId?: string;
  }
  export const asyncLocalStorage = new AsyncLocalStorage<LogContext>();