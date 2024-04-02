"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroMoLogger = void 0;
const winston_1 = require("winston");
const ErrorStackParser_1 = require("../error-stack-parser/ErrorStackParser");
const TransporterFactory_1 = require("../transport-config/TransporterFactory");
const TransporterType_enum_1 = require("../transport-config/enums/TransporterType.enum");
const ErrorHelper_1 = require("../error-stack-parser/ErrorHelper");
const LogLevel_enum_1 = require("./enums/LogLevel.enum");
class GroMoLogger {
    constructor(options) {
        this.isLoggingDisabled = false;
        this.errorStackParser = new ErrorStackParser_1.ErrorStackParser();
        this.errorStackHelper = new ErrorHelper_1.ErrorHelper();
        if (!options.transporterType) {
            options.transporterType = TransporterType_enum_1.TransporterType.SINGLE_FILE;
        }
        const transportConfiguratorFactory = new TransporterFactory_1.TransportConfiguratorFactory();
        const transportConfigurator = transportConfiguratorFactory.generate(options.transporterType);
        const transportList = transportConfigurator.configureTransports(options);
        this.isLoggingDisabled = transportList.length === 0;
        let logLevel = options.logLevel;
        this.logger = this.initializeLogger(transportList, logLevel);
        if (options.overrideConsole !== false) {
            this.overrideConsole();
        }
    }
    initializeLogger(transportList, logLevel = LogLevel_enum_1.LogLevel.INFO) {
        return (0, winston_1.createLogger)({
            level: logLevel, // REVIEW: Check how winston reacts if level is undefined.
            transports: transportList,
        });
    }
    overrideConsole() {
        console.log = (...args) => this.info(args.join(' '));
        console.error = (...args) => this.error(args.join(' '));
        console.warn = (...args) => this.warn(args.join(' '));
        console.debug = (...args) => this.debug(args.join(' '));
    }
    warn(message, context, id) {
        const error = this.errorStackHelper.getStackTrace(); // REVIEW: What happens if getStackTrace() returns / throws an error?
        this.logMessage('warn', message, error, context, id);
    }
    info(message, context, id) {
        const error = this.errorStackHelper.getStackTrace();
        this.logMessage('info', message, error, context, id);
    }
    error(message, context, id) {
        const error = this.errorStackHelper.getStackTrace();
        this.logMessage('error', message, error, context, id);
    }
    http(message, context, id) {
        const error = this.errorStackHelper.getStackTrace();
        this.logMessage('http', message, error, context, id);
    }
    verbose(message, context, id) {
        const error = this.errorStackHelper.getStackTrace();
        this.logMessage('verbose', message, error, context, id);
    }
    debug(message, context, id) {
        const error = this.errorStackHelper.getStackTrace();
        this.logMessage('debug', message, error, context, id);
    }
    logMessage(level, message, error, context, id) {
        if (this.isLoggingDisabled)
            return;
        const logData = { context };
        let logMessage;
        if (message instanceof Error) {
            logMessage = message.message;
            if (message.stack) {
                logData.parsedStack = this.errorStackParser.parse(message.stack);
            }
        }
        else {
            logMessage = message;
            if (error && error.stack) {
                logData.parsedStack = this.errorStackParser.parse(error.stack);
            }
        }
        if (id)
            logData.id = id;
        this.logger.log(level, logMessage, logData);
    }
}
exports.GroMoLogger = GroMoLogger;
