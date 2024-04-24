import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
const os = require('os');
import logger from '../logger/GroMoLogger';
import { ILoggerMiddleware } from './interfaces/ILoggerMiddleware';
import { metaDataHelper } from './MetaDataHelper';
import { asyncLocalStorage } from './ContextStorage';

export class FastifyMiddleware implements ILoggerMiddleware {
    requestMiddleware = (request: any, reply: any, done: any) => {

        // Extract requester IP address
        const requesterIP = request.ip;
    
        // Extract host IP
        const networkInterfaces = os.networkInterfaces();
        const extractedIPs = metaDataHelper.extractIP(networkInterfaces);
        const IPAddress = JSON.stringify(extractedIPs);

        // Extract URI path
        const uriPath = request.url ? request.url : request.req?.url;
    
        // Extract Trace-id
        const traceId: any = request.headers['trace-id'] || metaDataHelper.generateTraceId();
        request.headers['trace-id'] = traceId;

        // Method name
        const method = request.method ? request.method : request.req?.method;

        asyncLocalStorage.run({ traceId, IPAddress, requesterIP, uriPath, method }, () => {
            done();
        });
    }

    responseMiddleware = (request: any, reply: any, done: any) => {
        const responseTime = reply.elapsedTime ? reply.elapsedTime : reply.getResponseTime();

        // meta data from AsyncLocalStorage
        const logContext = asyncLocalStorage.getStore();
        const requesterIP = logContext?.requesterIP;
        const uriPath = logContext?.uriPath;
        const method = logContext?.method;
        const statusCode = reply.statusCode;

        logger.http(`[${method}] ${uriPath} - ${responseTime}ms - IP: ${requesterIP} - responseCode: ${statusCode}`);
        done();
    }

    errorMiddleware = (request: any, reply: any, error: any, done: any) => {
        const responseTime = reply.elapsedTime ? reply.elapsedTime : reply.getResponseTime();

        // meta data from AsyncLocalStorage
        const logContext = asyncLocalStorage.getStore();
        const requesterIP = logContext?.requesterIP;
        const uriPath = logContext?.uriPath;
        const method = logContext?.method;
        const statusCode = reply.statusCode;

        logger.http(`[${method}] ${uriPath} - ${responseTime}ms - IP: ${requesterIP} - responseCode: ${statusCode} - Error: ${error.message}`);
        done();
    }
      
}