"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const ErrorStackParser_1 = require("../error-stack-parser/ErrorStackParser");
const TransporterFactory_1 = require("../transport-config/TransporterFactory");
const TransporterType_enum_1 = require("../transport-config/enums/TransporterType.enum");
const ErrorHelper_1 = require("../error-stack-parser/ErrorHelper");
const LogLevel_enum_1 = require("./enums/LogLevel.enum");
const ContextStorage_1 = require("../interceptors/ContextStorage");
class GroMoLogger {
    constructor() {
        this.projectName = '';
        this.logger = undefined;
        this.isLoggingDisabled = false;
        this.errorStackParser = new ErrorStackParser_1.ErrorStackParser();
        this.errorStackHelper = new ErrorHelper_1.ErrorHelper();
    }
    setConfig(options) {
        this.projectName = options.nameOfProject;
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
            level: logLevel,
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
        const error = this.errorStackHelper.getStackTrace();
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
        const logContext = ContextStorage_1.asyncLocalStorage.getStore();
        if (this.isLoggingDisabled)
            return;
        const logData = { context };
        logData.traceId = logContext === null || logContext === void 0 ? void 0 : logContext.traceId;
        let logMessage;
        if (message instanceof Error) {
            logMessage = message.message;
            if (message.stack) {
                logData.parsedStack = this.errorStackParser.parse(message.stack, this.projectName);
            }
        }
        else {
            logMessage = message;
            if (error && error.stack) {
                logData.parsedStack = this.errorStackParser.parse(error.stack, this.projectName);
            }
        }
        if (id)
            logData.id = id;
        if (this.logger)
            this.logger.log(level, logMessage, logData);
    }
}
const logger = new GroMoLogger();
exports.default = logger;
