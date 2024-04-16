import { AsyncLocalStorage } from 'async_hooks';

interface LogContext {
  traceId?: string;
  IPAddress?: string;
}
export const asyncLocalStorage = new AsyncLocalStorage<LogContext>();