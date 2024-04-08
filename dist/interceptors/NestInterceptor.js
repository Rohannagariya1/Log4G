"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerInterceptorNest = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const os = require('os');
const operators_1 = require("rxjs/operators");
const ContextStorage_1 = require("./ContextStorage");
const GroMoLogger_1 = __importDefault(require("../logger/GroMoLogger"));
const ExtractIPAddress_1 = require("./ExtractIPAddress");
let LoggerInterceptorNest = class LoggerInterceptorNest {
    intercept(context, next) {
        const extractIPAddress = new ExtractIPAddress_1.ExtractIPAddress();
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
        const stringifiedIPs = JSON.stringify(extractedIPs, null, 2);
        return new rxjs_1.Observable(observer => {
            ContextStorage_1.asyncLocalStorage.run({ traceId }, () => {
                next.handle().pipe((0, operators_1.tap)((response) => observer.next(response), (error) => observer.error(error)), (0, operators_1.finalize)(() => {
                    const responseTime = Date.now() - start;
                    GroMoLogger_1.default.http(`[${method}] ${path} - ${responseTime}ms - IP: ${requesterIp} - , HostIp - ${stringifiedIPs}`);
                })).subscribe({
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
    generateTraceId() {
        const epochTime = Date.now().toString();
        const last4Digits = epochTime.substring(epochTime.length - 4);
        const fourRandomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `${last4Digits}${fourRandomDigits}`;
    }
};
exports.LoggerInterceptorNest = LoggerInterceptorNest;
exports.LoggerInterceptorNest = LoggerInterceptorNest = __decorate([
    (0, common_1.Injectable)()
], LoggerInterceptorNest);
