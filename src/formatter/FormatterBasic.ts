import { Logform, format} from "winston";
import { IFormatter } from "./interfaces/IFormatter";
import { LogFormat } from "./enums/logFormat.enum";

export class FormatLogBasic implements IFormatter {

    formatter (logFormat?: LogFormat) : any {
        if (!logFormat) {
            logFormat = LogFormat.TEXT;
          }

        let formatComponents = [
            format.timestamp(),
        ];
  

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
                    let parseStackMessage = '';
                    if (info.parsedStack) {
                        parseStackMessage = ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                    }
                    return  `${baseMsg} traceId :${traceId}  ${parseStackMessage} context:${contextMessage} id:${id} message:${message}` ;
                }));
                break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
        
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;
    }
}