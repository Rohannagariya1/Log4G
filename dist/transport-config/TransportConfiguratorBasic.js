"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransportConfiguratorBasic = void 0;
const winston_1 = require("winston");
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const FormatterBasic_1 = require("../formatter/FormatterBasic");
class TransportConfiguratorBasic {
    configureTransports(options) {
        const transportList = [];
        const formatLog = new FormatterBasic_1.FormatLogBasic();
        const loggerFormat = formatLog.formatter(options.logFormat);
        if (options.enableStdout) {
            transportList.push(new winston_1.transports.Console({
                format: loggerFormat,
            }));
        }
        if (options.fileOptions && !Array.isArray(options.fileOptions) && options.fileOptions.enableFile) {
            if (!options.nameOfProject || options.nameOfProject.trim() === '') {
                throw new Error("File logging is enabled but no project name was provided.");
            }
            const fileName = `${process.env.HOME}/.gromo-logger/${options.nameOfProject}-logs`;
            transportList.push(new winston_daily_rotate_file_1.default({
                filename: fileName,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxSize: '20m', // REVIEW: move to config
                maxFiles: '14d', // REVIEW: move to config
                format: loggerFormat,
            }));
        }
        else {
            throw new Error("Intialise the fileOption config properly in logger");
        }
        return transportList;
    }
}
exports.TransportConfiguratorBasic = TransportConfiguratorBasic;
