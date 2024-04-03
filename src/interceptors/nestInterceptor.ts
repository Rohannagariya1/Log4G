import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
// import { createNamespace } from 'async-local-storage';
import { AsyncLocalStorage } from 'async_hooks';
// const ns = createNamespace('my-namespace');

@Injectable()
export class LoggerInterceptorNest implements NestInterceptor {

  constructor(private readonly asyncLocalStorage: AsyncLocalStorage<string>) {}

  generateTraceId() {
    // ToDo: Change later
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    let traceId = request.headers['trace-id']; // Ensure your requests carry a trace-id header
    const requesterIp = request.ip;
    const path = request.path;

    const store = { traceId, requesterIp, path };

    this.asyncLocalStorage.run(store.toString(), () => {
      return next.handle();
    });
  }
}
