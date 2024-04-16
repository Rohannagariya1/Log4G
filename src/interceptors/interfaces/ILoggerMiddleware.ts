export interface ILoggerMiddleware {
  requestMiddleware: (req: any, res: any, next: any) => void;
}