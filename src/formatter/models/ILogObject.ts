export interface LogObject {
    timestamp: string;
    level: string;
    traceId?: string; 
    path?: string; 
    trace?: string; 
    message?: string;
    context?: string;
    id?: string;
    IPAddress?: string;
  }