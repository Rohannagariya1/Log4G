"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormatLogAdvance = void 0;
const winston_1 = require("winston");
const logFormat_enum_1 = require("./enums/logFormat.enum");
class FormatLogAdvance {
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
        // Review: Convert to switch case, and throw error in default case
        // Add JSON or printf formatting based on logFormat
        if (logFormat === logFormat_enum_1.LogFormat.JSON) {
            formatComponents.push(winston_1.format.json());
        }
        else {
            formatComponents.push(winston_1.format.printf((info) => {
                let baseMsg = `${info.timestamp} ${info.level}: ${info.message}`;
                if (info.context) {
                    baseMsg += ` | Context: ${JSON.stringify(info.context)}`;
                }
                if (info.parsedStack) {
                    baseMsg += ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                }
                return baseMsg;
            }));
        }
        const loggerFormat = winston_1.format.combine(...formatComponents);
        return loggerFormat;
    }
}
exports.FormatLogAdvance = FormatLogAdvance;
