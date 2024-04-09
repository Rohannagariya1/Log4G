import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
const os = require('os');
import { tap, catchError, finalize } from 'rxjs/operators';
import { asyncLocalStorage } from './ContextStorage';
import logger from '../logger/GroMoLogger'
import { ExtractIPAddress } from './ExtractIPAddress';

@Injectable()
export class LoggerInterceptorNest implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const extractIPAddress : ExtractIPAddress = new ExtractIPAddress();
    const start = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();

    const traceId = request.headers['trace-id'] || this.generateTraceId();
    const requesterIp = request.ip; // Assuming this gets the client IP. For real client IP behind proxy, use request.headers['x-forwarded-for'] || request.ip
    const path = request.url;
    const method = request.method; // HTTP method (GET, POST, PUT, DELETE)
    const networkInterfaces = os.networkInterfaces();
    
    const extractedIPs = extractIPAddress.extractIP(networkInterfaces);
    const IPAddress = JSON.stringify(extractedIPs);
    
    return new Observable(observer => {
      asyncLocalStorage.run({ traceId , IPAddress}, () => {
        next.handle().pipe(
          tap(
            (response) => observer.next(response),
            (error) => observer.error(error)
          ),
          finalize(() => {
            const statusCode = response.statusCode;
            const responseTime = Date.now() - start;
            logger.http(`[${method}] ${path} - ${responseTime}ms - IP: ${requesterIp} - responseCode :${statusCode} , HostIp - ${IPAddress}`);
          })
        ).subscribe({
          complete: () => observer.complete(),
        });
      });
    });
  }

  //   return new Observable(observer => {
  //     // No need to use `getStore()` and `set()` right after `run()` because the object is already set as the context
  //     asyncLocalStorage.run({ traceId }, () => {
  //       next.handle().pipe(

  //         tap(
  //           (response) => observer.next(response),
  //           (error) => observer.error(error)
  //         )
  //       ).subscribe({
  //         complete: () => observer.complete(),
  //       });
  //     });
  //   });
  // }
    // Initialize context for this async execution scope with traceId, requesterIp, and path
    // asyncLocalStorage.run({ traceId}, () => {

    //   // Now, return the observable directly. NestJS will subscribe to it.
    //   return next.handle().pipe(
    //     finalize(() => {
    //       const responseTime = Date.now() - start;
    //       logger.http(`[${method}] ${path} - ${responseTime}ms - Trace ID: ${traceId} - IP: ${requesterIp} - , HostIp - ${stringifiedIPs}`);
    //     })
    //   );
    // })

    // return next.handle();
  

  generateTraceId(): string {
    const epochTime = Date.now().toString();
    const last4Digits = epochTime.substring(epochTime.length - 4);

    const fourRandomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `${last4Digits}${fourRandomDigits}`;
  }
}
