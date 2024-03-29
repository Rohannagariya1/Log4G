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
                formatComponents.push(winston_1.format.json());
                break;
            case logFormat_enum_1.LogFormat.TEXT:
                formatComponents.push(winston_1.format.printf((info) => {
                    let baseMsg = `${info.timestamp} ${info.level}: ${info.message}`;
                    if (info.context) {
                        baseMsg += ` | Context: ${JSON.stringify(info.context)}`; // Review: Get reviewed by Saket for mem leaks
                    }
                    if (info.parsedStack) {
                        baseMsg += ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                    }
                    return baseMsg;
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
