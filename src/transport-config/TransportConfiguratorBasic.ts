import { transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ILoggerOptions } from '../logger/models/ILoggerOptions';
import { ITransportConfigurator } from './interfaces/ITransportconfigurator';
import { FormatLogBasic } from '../formatter/FormatterBasic';
import { LogLevel } from '../logger/enums/LogLevel.enum';
import { FormatLogWithBifurcation } from '../formatter/FormatterAdvance';
export class TransportConfiguratorBasic implements ITransportConfigurator {
    configureTransports(options: ILoggerOptions): any[] {
        const transportList = [];
   
        const formatLog = new FormatLogBasic();
        const advanceFormatLog = new FormatLogWithBifurcation();
        const loggerFormat = formatLog.formatter(options.logFormat,LogLevel.HTTP);
        if (options.enableStdout) {
  
            transportList.push(new transports.Console({
                format: loggerFormat,
            }));
        }

        if (options.fileOptions && options.fileOptions.enableFile) {

            if (!options.nameOfProject || options.nameOfProject.trim() === '') {
                throw new Error("File logging is enabled but no project name was provided.");
            }

            const fileName = `${process.env.HOME}/.gromo-logger/APPLICATION_LOG/${options.nameOfProject}-logs`;
  
            transportList.push(new DailyRotateFile({
                filename: `APPLICATION_LOG/${options.nameOfProject}-logs`,
                datePattern: options.fileOptions.datePattern,
                zippedArchive: options.fileOptions.zippedArchive,
                maxSize: options.fileOptions.maxSize, 
                maxFiles: options.fileOptions.maxFiles,
                format: loggerFormat,
            }));
        } else {
            throw new Error("Intialise the fileOption config properly in logger");
        }
        if(options.enableAccessLog){
            const advaceFormatter = advanceFormatLog.formatter(options.logFormat,LogLevel.HTTP);
            if (!options.nameOfProject || options.nameOfProject.trim() === '') {
                throw new Error("File logging is enabled but no project name was provided.");
            }

            const fileName = `${process.env.HOME}/.gromo-logger/ACCESS_LOG/${options.nameOfProject}-logs`;
  
            transportList.push(new DailyRotateFile({
                filename: `ACCESS_LOG/${options.nameOfProject}-logs`,
                datePattern: options.fileOptions.datePattern,
                zippedArchive: options.fileOptions.zippedArchive,
                maxSize: options.fileOptions.maxSize, 
                maxFiles: options.fileOptions.maxFiles,
                format: advaceFormatter,
            }));
        }
        


    
        return transportList;
    
    }
        
}