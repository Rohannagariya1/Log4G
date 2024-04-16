import { LogFormat } from "../../formatter/enums/logFormat.enum";
import { LogLevel } from "../enums/LogLevel.enum";
import { TransporterType } from "../../transport-config/enums/TransporterType.enum";
// review the configs of datepattern , zippedarchive,maxsize,maxDuration
/**
         it will look like this 
                        datePattern: 'YYYY-MM-DD',
                        zippedArchive: false,
                        maxSize: '20m', // REVIEW: move to config
                        maxFiles: '14d',
                        level: fileList.logLevel,
                        format: loggerFormat,
 */

export interface ILoggerOptions {
    enableStdout?: boolean;
    nameOfProject: string;
    fileOptions: 
    {
      enableFile: boolean;
      logLevel: LogLevel;
      datePattern: string,
      zippedArchive: boolean,
      maxSize: string,
      maxDuration: string,

    };
    logLevel?: LogLevel;
    logFormat?: LogFormat;
    transporterType?: TransporterType;
    overrideConsole?: boolean;
    enableAccessLog?: boolean;
}
// Review: Add difference between between 2 logLevel in ReadMe.md file as documentation.
