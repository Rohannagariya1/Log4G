import { createLogger, Logger } from 'winston';
import { ILogger } from './interfaces/ILogger';
import { ILoggerOptions } from './models/ILoggerOptions';
import { ErrorStackParser } from '../error-stack-parser/ErrorStackParser';
import { TransportConfiguratorFactory } from '../transport-config/TransporterFactory';
import { TransporterType } from '../transport-config/enums/TransporterType.enum';
import { ErrorHelper } from '../error-stack-parser/ErrorHelper';
import { LogLevel } from './enums/LogLevel.enum';
import { asyncLocalStorage } from '../interceptors/ContextStorage';
import { InputHandler } from './InputHandler';


class GroMoLogger implements ILogger {
    private projectName : string='';
    public logger: Logger | undefined = undefined;
;
    private isLoggingDisabled: boolean = false;
    private errorStackParser: ErrorStackParser = new ErrorStackParser();
    private errorStackHelper : ErrorHelper = new ErrorHelper();
    private inputHandler : InputHandler = new InputHandler();

    constructor() { }
    setConfig(options: ILoggerOptions){
        this.projectName =options.nameOfProject;
        if(!options.transporterType){
            options.transporterType = TransporterType.SINGLE_FILE;
        }
        const transportConfiguratorFactory = new TransportConfiguratorFactory(); 
        const transportConfigurator = transportConfiguratorFactory.generate(options.transporterType);

        const transportList = transportConfigurator.configureTransports(options);

        this.isLoggingDisabled = transportList.length === 0;
        let logLevel = options.logLevel;

        this.logger = this.initializeLogger(transportList, logLevel);
        if(options.overrideConsole !== false){
            this.overrideConsole(); 
        }
    }

    private initializeLogger(transportList: any[], logLevel : LogLevel = LogLevel.INFO): Logger {
        return createLogger({
            level: logLevel, 
            transports: transportList,
        });
    }

    private overrideConsole() {
        console.log = (...args: any[]) => this.info(args);
        console.error = (...args: any[]) => this.error(args);
        console.warn = (...args: any[]) => this.warn(args);
        console.debug = (...args: any[]) => this.debug(args);

    }

  
    public warn(...args:any[]): void {
        let { message, context , id,error} = this.inputHandler.processArgs(args);
        if(!error){
         error = this.errorStackHelper.getStackTrace();}
        this.logMessage('warn', message, error, context, id);
    }
    public info(...args:any[]): void {
        let { message, context , id,error} = this.inputHandler.processArgs(args);
        if(!error){
         error = this.errorStackHelper.getStackTrace();}
        this.logMessage('info', message, error, context, id);
    }
  
    public error(...args:any[]): void {
        let { message, context , id,error} = this.inputHandler.processArgs(args);
        if(!error){
         error = this.errorStackHelper.getStackTrace();}
        this.logMessage('error', message, error, context, id);
    }
  
    public http(...args:any[]): void {
        let { message, context , id,error} = this.inputHandler.processArgs(args);
        if(!error){
         error = this.errorStackHelper.getStackTrace();}
        this.logMessage('http', message, error, context, id);
    }
  
    public verbose(...args:any[]): void {
        let { message, context , id,error} = this.inputHandler.processArgs(args);
        if(!error){
         error = this.errorStackHelper.getStackTrace();}
        this.logMessage('verbose', message, error, context, id);
    }
  
    public debug(...args:any[]): void {
        let { message, context , id,error} = this.inputHandler.processArgs(args);
        if(!error){
         error = this.errorStackHelper.getStackTrace();}
        this.logMessage('debug', message, error, context, id);
    }
  
    private logMessage(level: string, message: string ,error?: Error, context?: string, id?: string): void {
        if (this.isLoggingDisabled) return;

            
        const logContext = asyncLocalStorage.getStore();

       
        
        if (this.isLoggingDisabled) return;
    
        const logData: { [key: string]: any } = { context };
        logData.traceId = logContext?.traceId;
        logData.IPAddress = logContext?.IPAddress;
        let logMessage: string;
  
            logMessage = message;
            if (error) {
                if (error.message) {

                    logMessage += ` - Error: ${error.message}`;
                }
                if (error.stack) {
                    logData.parsedStack = this.errorStackParser.parse(error.stack,this.projectName);
                }
            
        }
    
  
        if (id) logData.id = id;
        if(this.logger)
        this.logger.log(level, logMessage, logData);
}

public getLoggerForTest(): Logger | undefined {
    return this.logger;
}

}
const logger = new GroMoLogger()
export default logger