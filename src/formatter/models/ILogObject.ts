interface LogObject {
    timestamp: string;
    level: string;
    traceId?: string; 
    path?: string; 
    parsedStack?: string; 
    message?: string;
  }