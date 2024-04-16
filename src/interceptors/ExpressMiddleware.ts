import { Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ILoggerMiddleware } from './interfaces/ILoggerMiddleware';
import { MetaDataHelper } from './MetaDataHelper';
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

    constructor(private readonly metaDataHelper: MetaDataHelper) {}

    requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
        const start = Date.now();
    
        // Extract requester IP address
        const requesterIP = req.ip;
    
        // Extract host IP
        const networkInterfaces = os.networkInterfaces();
        const extractedIPs = this.metaDataHelper.extractIP(networkInterfaces);
        const IPAddress = JSON.stringify(extractedIPs);

        // Extract URI path
        const uriPath = req.path;
    
        // Extract Trace-id
        const traceId: any = req.headers['trace-id'] || this.metaDataHelper.generateTraceId();
        req.headers['trace-id'] = traceId;

        // Method name
        const method = req.method;

        asyncLocalStorage.run({ traceId, IPAddress }, () => {
            res.on('end', () => {
                const end = Date.now();
                const responseTime = end - start;
                
                const statusCode = res.statusCode;
                logger.http(`[${method}] ${uriPath} - ${responseTime}ms - IP: ${requesterIP} - responseCode: ${statusCode}`);
            });

            res.on('error', (error: any) => {
                const end = Date.now();
                const responseTime = end - start;
                
                const statusCode = res.statusCode;
                logger.http(`[${method}] ${uriPath} - ${responseTime}ms - IP: ${requesterIP} - responseCode: ${statusCode} - Error: ${error.message}`);
            });

            next();
        });
    };
}