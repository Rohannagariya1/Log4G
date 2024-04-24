import { AsyncLocalStorage } from 'async_hooks';

interface LogContext {
  traceId?: string;
  IPAddress?: string;
  requesterIP?: string;
  uriPath?: string;
  method?: string;
}
export const asyncLocalStorage = new AsyncLocalStorage<LogContext>();