"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportConfiguratorWithBifurcation = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const FormatterAdvance_1 = require("../formatter/FormatterAdvance");
const logFormat_enum_1 = require("../formatter/enums/logFormat.enum");
const GetLogTypeFromLevel_1 = require("./GetLogTypeFromLevel");
const LogLevel_enum_1 = require("../logger/enums/LogLevel.enum");
// Review: Comment this code to be more understandable to others
class TransportConfiguratorWithBifurcation {
    configureTransports(options) {
        let transportList = [];
        const formatLog = new FormatterAdvance_1.FormatLogWithBifurcation();
        const getLogTypeFromLevel = new GetLogTypeFromLevel_1.GetLogTypeFromLevel();
        if (!options.logFormat) {
            options.logFormat = logFormat_enum_1.LogFormat.TEXT;
        }
        if (options.enableStdout) {
            const loggerFormat = formatLog.formatter(options.logFormat);
            transportList.push(new winston_1.transports.Console({
                format: loggerFormat,
                level: options.logLevel,
            }));
        }
        const allLevels = Object.values(LogLevel_enum_1.LogLevel);
        if (options.fileOptions && options.fileOptions.logLevel) {
            // Ensure the project name is provided
            if (!options.nameOfProject || options.nameOfProject.trim() === '') {
                throw new Error("File logging is enabled but no project name was provided.");
            }
            // Find index of the provided log level in the enum array
            const providedLevelIndex = allLevels.indexOf(options.fileOptions.logLevel);
            // Determine levels to include based on the provided log level
            const levelsToInclude = allLevels.slice(0, providedLevelIndex + 1);
            // Ensure 'http' log level is always included if not already
            if (!levelsToInclude.includes(LogLevel_enum_1.LogLevel.HTTP)) {
                levelsToInclude.push(LogLevel_enum_1.LogLevel.HTTP);
            }
            // Create a transport for each level
            levelsToInclude.forEach(logLevel => {
                const logType = getLogTypeFromLevel.getLogType(logLevel);
                const fileName = `${options.nameOfProject}/${logType}/${logLevel}/${options.nameOfProject}-${logType}-${logLevel}`;
                const loggerFormat = formatLog.formatter(options.logFormat, logLevel);
                transportList.push(new winston_daily_rotate_file_1.default({
                    filename: fileName,
                    datePattern: options.fileOptions.datePattern,
                    zippedArchive: options.fileOptions.zippedArchive,
                    maxSize: options.fileOptions.maxSize,
                    maxFiles: options.fileOptions.maxFiles,
                    level: logLevel,
                    format: loggerFormat,
                }));
            });
        }
        return transportList;
    }
}
exports.TransportConfiguratorWithBifurcation = TransportConfiguratorWithBifurcation;
