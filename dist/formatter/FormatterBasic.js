"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatLogBasic = void 0;
const winston_1 = require("winston");
const logFormat_enum_1 = require("./enums/logFormat.enum");
class FormatLogBasic {
    formatter(logFormat) {
        if (!logFormat) {
            logFormat = logFormat_enum_1.LogFormat.TEXT;
        }
        let formatComponents = [
            winston_1.format.timestamp(),
        ];
        switch (logFormat) {
            case logFormat_enum_1.LogFormat.JSON:
                formatComponents.push(winston_1.format.printf((info) => {
                    const logObject = {
                        timestamp: info.timestamp,
                        level: info.level,
                    };
                    if (info.traceId) {
                        logObject.traceId = info.traceId;
                    }
                    logObject.path = info.path || '';
                    logObject.parsedStack = info.parsedStack ? JSON.stringify(info.parsedStack) : '';
                    logObject.message = info.message;
                    return JSON.stringify(logObject);
                }));
                break;
            case logFormat_enum_1.LogFormat.TEXT:
                formatComponents.push(winston_1.format.printf((info) => {
                    let baseMsg = `${info.timestamp} ${info.level}`;
                    let message = info.message;
                    let contextMessage = info.context || '';
                    let traceId = info.traceId || '';
                    let id = info.id || '';
                    let parseStackMessage = '';
                    if (info.parsedStack) {
                        parseStackMessage = ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                    }
                    return `${baseMsg} traceId :${traceId}  ${parseStackMessage} context:${contextMessage} id:${id} message:${message}`;
                }));
                break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
        const loggerFormat = winston_1.format.combine(...formatComponents);
        return loggerFormat;
    }
}
exports.FormatLogBasic = FormatLogBasic;
