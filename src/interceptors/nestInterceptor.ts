import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
const os = require('os');
import { tap, catchError, finalize } from 'rxjs/operators';
import { asyncLocalStorage } from './ContextStorage';
import logger from '../logger/GroMoLogger'
import { metaDataHelper } from './MetaDataHelper';
import { IMetaDataHelper } from './interfaces/IMetaDataHelper';

export class LoggerInterceptorNest implements NestInterceptor {


  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
   
    const response = httpContext.getResponse();

    const traceId = request.headers['trace-id'] || metaDataHelper.generateTraceId();
    request.headers['trace-id'] = traceId; //  review this change , Im updating the trace id in the header of the request 
    const requesterIP = request.ip?.toString() || ''; // Assuming this gets the client IP. For real client IP behind proxy, use request.headers['x-forwarded-for'] || request.ip
    const uriPath = request.url;
    const method = request.method; // HTTP method (GET, POST, PUT, DELETE)
    const networkInterfaces = os.networkInterfaces();
    const extractedIPs = metaDataHelper.extractIP(networkInterfaces);
    const IPAddress = JSON.stringify(extractedIPs);
    
    return new Observable(observer => {
      asyncLocalStorage.run({ traceId , IPAddress, requesterIP, uriPath, method }, () => {
        next.handle().pipe(
          tap(() => {
            // Only log successful responses here, if error is not thrown

              const statusCode = response.statusCode;
              logger.http(`[${method}] ${uriPath} - ${Date.now() - start}ms - IP: ${requesterIP} - responseCode: ${statusCode}`);

          }),
          catchError((error) => {
            // Handle and log errors
            const statusCode = error.status; // Use a default if no specific status is set
            logger.http(`[${method}] ${uriPath} - ${Date.now() - start}ms - IP: ${requesterIP} - responseCode: ${statusCode} - Error: ${error.message}`);
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
}
