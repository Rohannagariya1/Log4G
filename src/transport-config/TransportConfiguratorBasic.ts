import { transports, format  } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ILoggerOptions } from '../logger/models/ILoggerOptions';
import { ITransportConfigurator } from './interfaces/ITransportconfigurator';
import { FormatLogBasic } from '../formatter/FormatterBasic';

export class TransportConfiguratorBasic implements ITransportConfigurator {
    configureTransports(options: ILoggerOptions): any[] {
        const transportList = [];
   
        const formatLog = new FormatLogBasic();

        const loggerFormat = formatLog.formatter(options.logFormat);
        if (options.enableStdout) {
  
            transportList.push(new transports.Console({
                format: loggerFormat,
            }));
        }

        if (options.fileOptions && !Array.isArray(options.fileOptions) && options.fileOptions.enableFile) {

            if (!options.fileOptions.nameOfProject || options.fileOptions.nameOfProject.trim() === '') {
                throw new Error("File logging is enabled but no project name was provided.");
            }

            const fileName = `${process.env.HOME}/.gromo-logger/${options.fileOptions.nameOfProject}-logs`;
  
            transportList.push(new DailyRotateFile({
                filename: fileName,
                datePattern: 'YYYY-MM-DD',
                zippedArchive: false,
                maxSize: '20m', // REVIEW: move to config
                maxFiles: '14d', // REVIEW: move to config
                format: loggerFormat,
            }));
        } else {
            throw new Error("Intialise the fileOption config properly in logger");
        }
    
        return transportList;
    
    }
        
}