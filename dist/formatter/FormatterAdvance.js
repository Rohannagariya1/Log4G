"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatLogWithBifurcation = void 0;
const winston_1 = require("winston");
const logFormat_enum_1 = require("./enums/logFormat.enum");
class FormatLogWithBifurcation {
    formatter(logFormat, logLevel) {
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
                formatComponents.push(winston_1.format.json());
                break;
            case logFormat_enum_1.LogFormat.TEXT:
                formatComponents.push(winston_1.format.printf((info) => {
                    let baseMsg = `${info.timestamp} ${info.level}: ${info.message}`;
                    let contextMessage = info.context || '';
                    let parseStackMessage = '';
                    if (info.parsedStack) {
                        parseStackMessage = ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                    }
                    return baseMsg + contextMessage + parseStackMessage;
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
