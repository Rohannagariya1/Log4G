import { transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ILoggerOptions } from '../logger/models/ILoggerOptions';
import { FormatLogWithBifurcation } from '../formatter/FormatterAdvance';
import { ITransportConfigurator } from './interfaces/ITransportconfigurator';
import { LogFormat } from '../formatter/enums/logFormat.enum';
import { LogType } from './enums/LogType.enum';
import { GetLogTypeFromLevel } from './GetLogTypeFromLevel';
import { LogLevel } from '../logger/enums/LogLevel.enum';
import { IFormatter } from '../formatter/interfaces/IFormatter';

// Review: Comment this code to be more understandable to others
export class TransportConfiguratorWithBifurcation implements ITransportConfigurator {
    configureTransports(options: ILoggerOptions): any[] {
        let transportList = [];
        const formatLog : IFormatter = new FormatLogWithBifurcation();
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

        const allLevels = Object.values(LogLevel);

    if (options.fileOptions && options.fileOptions.logLevel) {
        // Ensure the project name is provided
        if (!options.nameOfProject || options.nameOfProject.trim() === '') {
            throw new Error("File logging is enabled but no project name was provided.");
        }

        // Find index of the provided log level in the enum array
        const providedLevelIndex = allLevels?.indexOf(options?.fileOptions?.logLevel);
        
        // Determine levels to include based on the provided log level
        const levelsToInclude = allLevels?.slice(0, providedLevelIndex + 1);
        
        // Ensure 'http' log level is always included if not already
        if(options.enableAccessLog) {
            levelsToInclude.push(LogLevel.HTTP);
        }


        // Create a transport for each level
        levelsToInclude.forEach(logLevel => {
            const logType = getLogTypeFromLevel.getLogType(logLevel);
            const fileName = `${process.env.HOME}/.gromo-logger/${options.nameOfProject}/${logType}/${options.nameOfProject}-${logType}-${logLevel}`;
            const loggerFormat = formatLog.formatter(options.logFormat, logLevel);

            transportList.push(new DailyRotateFile({
                filename: `${options.nameOfProject}/${logType}/${options.nameOfProject}-${logType}-${logLevel}`,
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