import { Request, Response, NextFunction } from 'express';
import { ILoggerMiddleware } from './interfaces/ILoggerMiddleware';
import { metaDataHelper } from './MetaDataHelper';
import { asyncLocalStorage } from './ContextStorage';
const os = require('os');
import logger from '../logger/GroMoLogger'


/**
 * Extract these information from the request:
 * requester ip
 * host ip
 * uri path
 * trace id
 * response time
 * API method name
 */
export class ExpressMiddleware implements ILoggerMiddleware {

    requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
    
        // Extract requester IP address
        const requesterIP = req.ip;
    
        // Extract host IP
        const networkInterfaces = os.networkInterfaces();
        const extractedIPs = metaDataHelper.extractIP(networkInterfaces);
        const IPAddress = JSON.stringify(extractedIPs);

        // Extract URI path
        const uriPath = req.path;
    
        // Extract Trace-id
        const traceId: any = req.headers['trace-id'] || metaDataHelper.generateTraceId();
        req.headers['trace-id'] = traceId;

        // Method name
        const method = req.method;

        res.once('finish', () => {
            const end = Date.now();
            const responseTime = end - start;
            
            const statusCode = res.statusCode;
            logger.http(`[${method}] ${uriPath} - ${responseTime}ms - IP: ${requesterIP} - responseCode: ${statusCode}`);
        });

        res.once('error', (error: any) => {
            const end = Date.now();
            const responseTime = end - start;
            
            const statusCode = res.statusCode;
            logger.http(`[${method}] ${uriPath} - ${responseTime}ms - IP: ${requesterIP} - responseCode: ${statusCode} - Error: ${error.message}`);
        });

        asyncLocalStorage.run({ traceId, IPAddress }, () => {
            next();
        });
    };
}