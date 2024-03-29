import { error } from "console";
import { LogLevel } from "../logger/enums/LogLevel.enum";
import { LogType } from "./enums/LogType.enum";

export class GetLogTypeFromLevel {
    getLogType (logLevel: LogLevel):LogType{
        switch (logLevel) {
            case LogLevel.DEBUG:
                return LogType.APPLICATION_LOG
            case LogLevel.INFO:
                return LogType.APPLICATION_LOG;
            case LogLevel.WARNING:
                return LogType.APPLICATION_LOG;
            case LogLevel.SILLY:
                return LogType.APPLICATION_LOG;  
            case LogLevel.VERBOSE:
                return LogType.APPLICATION_LOG;
            case LogLevel.ERROR:
                return LogType.ERROR_LOG;
            case LogLevel.HTTP:
                return LogType.ACCESS_LOG;    
            default:
                throw new Error("Invalid Log Level: " + logLevel);
        }
    } 
}