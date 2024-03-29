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
// Review: Comment this code to be more understandable to others
class TransportConfiguratorWithBifurcation {
    configureTransports(options) {
        let transportList = [];
        const formatLog = new FormatterAdvance_1.FormatLogAdvance();
        const getLogTypeFromLevel = new GetLogTypeFromLevel_1.GetLogTypeFromLevel();
        if (!options.logFormat) {
            options.logFormat = logFormat_enum_1.LogFormat.TEXT;
        }
        if (options.enableStdout) {
            const loggerFormat = formatLog.formatter(options.logFormat);
            transportList.push(new winston_1.transports.Console({
                format: loggerFormat,
            }));
        }
        if (options.fileOptions) {
            const fileOptionsArray = Array.isArray(options.fileOptions) ? options.fileOptions : [options.fileOptions];
            for (const fileList of fileOptionsArray) {
                const loggerFormat = formatLog.formatter(options.logFormat, fileList.logLevel);
                if (fileList.enableFile) {
                    if (!fileList.nameOfProject || fileList.nameOfProject.trim() === '') {
                        throw new Error("File logging is enabled but no project name was provided.");
                    }
                    const logType = getLogTypeFromLevel.getLogType(fileList.logLevel);
                    const fileName = `${process.env.HOME}/.gromo-logger/${fileList.nameOfProject}/${logType}/${fileList.logLevel}/${fileList.nameOfProject}-${logType}-${fileList.logLevel}`;
                    transportList.push(new winston_daily_rotate_file_1.default({
                        filename: fileName,
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: false,
                        maxSize: '20m', // REVIEW: move to config
                        maxFiles: '14d',
                        level: fileList.logLevel,
                        format: loggerFormat,
                    }));
                }
            }
        }
        return transportList;
    }
}
exports.TransportConfiguratorWithBifurcation = TransportConfiguratorWithBifurcation;
