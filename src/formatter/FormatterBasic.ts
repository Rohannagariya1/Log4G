import { Logform, format} from "winston";
import { IFormatter } from "./interfaces/IFormatter";
import { LogFormat } from "./enums/logFormat.enum";
import { LogLevel } from "../logger/enums/LogLevel.enum";

export class FormatLogBasic implements IFormatter {

    formatter (logFormat?: LogFormat , logLevel?: LogLevel) : any {
        if (!logFormat) {
            logFormat = LogFormat.TEXT;
          }
          // we are using this filter to avoid the http logs in the application log
        const filterLevel = (level: LogLevel) => format((info) => {
            return info.level === level ? false : info;
        })();
        let formatComponents = [
            format.timestamp(),
        ];
        if (logLevel) {
            formatComponents.unshift(filterLevel(logLevel));
        }

        switch (logFormat) {
            case LogFormat.JSON:
                formatComponents.push(format.printf((info) => {

                    const logObject : LogObject = {
                        timestamp: info.timestamp,
                        level: info.level,
                    };
                    if (info.traceId) {
                        logObject.traceId = info.traceId;
                    }
                    logObject.IPAddress = info.IPAddress
                    logObject.path = info.path || '';
                    logObject.parsedStack = info.parsedStack ? JSON.stringify(info.parsedStack) : '';
                    logObject.message = info.message;
                    return JSON.stringify(logObject);
                }));
                break;
            case LogFormat.TEXT:
                formatComponents.push(format.printf((info) => { 
                    let baseMsg = `${info.timestamp} ${info.level}`;
                    let message = info.message;
                    let contextMessage = info.context || ''; 
                    let traceId = info.traceId || '';
                    let id = info.id || '';
                    let IPAddress = info.IPAddress || '';
                    let parseStackMessage = '';
                    if (info.parsedStack) {
                        parseStackMessage = ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                    }
                    return  `${baseMsg} traceId :${traceId} HostIP :${IPAddress} ${parseStackMessage} context:${contextMessage} id:${id} message:${message}` ;
                }));
                break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
        
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;
    }
}