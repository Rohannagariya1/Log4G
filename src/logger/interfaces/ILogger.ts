export interface ILogger {
    info(message: string | Error, context?: string, id?: string): void;
    warn(message: string | Error, context?: string, id?: string): void;
    error(message: string | Error, context?: string, id?: string): void;
    http(message: string | Error, context?: string, id?: string): void;
    verbose(message: string | Error, context?: string, id?: string): void;
    debug(message: string | Error, context?: string, id?: string): void;

  }

  