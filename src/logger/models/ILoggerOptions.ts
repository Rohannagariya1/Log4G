import { LogFormat } from "../../formatter/enums/logFormat.enum";
import { LogLevel } from "../enums/LogLevel.enum";
import { TransporterType } from "../../transport-config/enums/TransporterType.enum";

export interface ILoggerOptions {
    enableStdout?: boolean;
    fileOptions?: Array<{
      enableFile: boolean;
      nameOfProject: string;
      logLevel: LogLevel;
    }> | 
    {
      enableFile: boolean;
      nameOfProject: string;
      logLevel: LogLevel;

    };
    logLevel?: LogLevel;
    logFormat?: LogFormat;
    transporterType?: TransporterType;
    overRideConsole?: boolean;
}
// Review: Add difference between between 2 logLevel in ReadMe.md file as documentation.
