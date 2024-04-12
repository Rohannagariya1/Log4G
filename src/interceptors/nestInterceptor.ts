import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
const os = require('os');
import { tap, catchError, finalize } from 'rxjs/operators';
import { asyncLocalStorage } from './ContextStorage';
import logger from '../logger/GroMoLogger'
import { ExtractIPAddress } from './ExtractIPAddress';
import { IExtractIPAddress } from './interfaces/IExtractIPAddress';

@Injectable()
export class LoggerInterceptorNest implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const extractIPAddress : IExtractIPAddress = new ExtractIPAddress();
    const start = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
   
    const response = httpContext.getResponse();

    const traceId = request.headers['trace-id'] || this.generateTraceId();
    request.headers['trace-id'] = traceId; //  review this change , Im updating the trace id in the header of the request 
    const requesterIp = request.ip; // Assuming this gets the client IP. For real client IP behind proxy, use request.headers['x-forwarded-for'] || request.ip
    const path = request.url;
    const method = request.method; // HTTP method (GET, POST, PUT, DELETE)
    const networkInterfaces = os.networkInterfaces();
    request.traceId = traceId;
    const extractedIPs = extractIPAddress.extractIP(networkInterfaces);
    const IPAddress = JSON.stringify(extractedIPs);
    
    return new Observable(observer => {
      asyncLocalStorage.run({ traceId , IPAddress}, () => {
        next.handle().pipe(
          tap(() => {
            // Only log successful responses here, if error is not thrown
            if (!response.headersSent) {
              const statusCode = response.statusCode;
              logger.http(`[${method}] ${path} - ${Date.now() - start}ms - IP: ${requesterIp} - responseCode: ${statusCode}`);
            }
          }),
          catchError((error) => {
            // Handle and log errors
            const statusCode = error.status; // Use a default if no specific status is set
            logger.http(`[${method}] ${path} - ${Date.now() - start}ms - IP: ${requesterIp} - responseCode: ${statusCode} - Error: ${error.message}`);
            return throwError(error); // Rethrow the error for further handling
          }),
          finalize(() => {
            // Any cleanup can go here
            if (!observer.closed) {
              observer.complete();
            }
          })
        ).subscribe(
          response => observer.next(response),
          error => observer.error(error),
          () => observer.complete()
        );
      });
    });
  }

  

  generateTraceId(): string {
    const epochTime = Date.now().toString();
    const last4Digits = epochTime.substring(epochTime.length - 4);

    const fourRandomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `${last4Digits}${fourRandomDigits}`;
  }
}
