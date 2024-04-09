"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatLogWithBifurcation = void 0;
const winston_1 = require("winston");
const logFormat_enum_1 = require("./enums/logFormat.enum");
class FormatLogWithBifurcation {
    formatter(logFormat, logLevel) {
        if (!logFormat) {
            logFormat = logFormat_enum_1.LogFormat.TEXT;
        }
        // This function filters logs and only keeps ones that are of specified log level
        const filterLevel = (level) => (0, winston_1.format)((info) => {
            return info.level === level ? info : false;
        })();
        let formatComponents = [
            winston_1.format.timestamp(),
        ];
        // Optionally add filterLevel if logLevel is provided and not empty
        if (logLevel) {
            formatComponents.unshift(filterLevel(logLevel));
        }
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
                    logObject.path = info.path || '',
                        logObject.parsedStack = info.parsedStack ? JSON.stringify(info.parsedStack) : '',
                        logObject.context = info.context || ' ',
                        logObject.id = info.id || ' ',
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
exports.FormatLogWithBifurcation = FormatLogWithBifurcation;
