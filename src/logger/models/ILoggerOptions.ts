import { LogFormat } from "../../formatter/enums/logFormat.enum";
import { LogLevel } from "../enums/LogLevel.enum";
import { TransporterType } from "../../transport-config/enums/TransporterType.enum";

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