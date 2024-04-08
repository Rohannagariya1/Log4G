import { transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ILoggerOptions } from '../logger/models/ILoggerOptions';
import { FormatLogWithBifurcation } from '../formatter/FormatterAdvance';
import { ITransportConfigurator } from './interfaces/ITransportconfigurator';
import { LogFormat } from '../formatter/enums/logFormat.enum';
import { LogType } from './enums/LogType.enum';
import { GetLogTypeFromLevel } from './GetLogTypeFromLevel';

// Review: Comment this code to be more understandable to others
export class TransportConfiguratorWithBifurcation implements ITransportConfigurator {
    configureTransports(options: ILoggerOptions): any[] {
        let transportList = [];
        const formatLog = new FormatLogWithBifurcation();
        const getLogTypeFromLevel : GetLogTypeFromLevel = new GetLogTypeFromLevel();

        if (!options.logFormat) {
            options.logFormat = LogFormat.TEXT;
        }
      
        if (options.enableStdout) {
            const loggerFormat = formatLog.formatter(options.logFormat);

            transportList.push(new transports.Console({
                format: loggerFormat,
                level :options.logLevel,
            }));
        }

        if(options.fileOptions){
            const fileOptionsArray = Array.isArray(options.fileOptions) ? options.fileOptions : [options.fileOptions];
            for (const fileList of fileOptionsArray){
                const loggerFormat = formatLog.formatter(options.logFormat, fileList.logLevel);
                if (fileList.enableFile) {
                    if (!options.nameOfProject || options.nameOfProject.trim() === '') {
                        throw new Error("File logging is enabled but no project name was provided.");
                    }
                 
                   const logType= getLogTypeFromLevel.getLogType(fileList.logLevel);

                    const fileName = `${options.nameOfProject}/${logType}/${fileList.logLevel}/${options.nameOfProject}-${logType}-${fileList.logLevel}`;

                    transportList.push(new DailyRotateFile({
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