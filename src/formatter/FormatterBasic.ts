import { Logform, format} from "winston";
import { IFormatter } from "./interfaces/IFormatter";
import { LogFormat } from "./enums/logFormat.enum";
import { LogLevel } from "../logger/enums/LogLevel.enum";
import { GetJsonFormat } from "./GetJsonFormat";
import { GetTextFormat } from "./GetTextFormat";

export class FormatLogBasic implements IFormatter {
   
    formatter (logFormat?: LogFormat , logLevel?: LogLevel) : any {
        let getJsonFormat : GetJsonFormat = new GetJsonFormat();
        let getTextFormat : GetTextFormat = new GetTextFormat();
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
                formatComponents.push(format.printf((info) =>  getJsonFormat.formatLog(info)));
                break;
            case LogFormat.TEXT:
                formatComponents.push(format.printf((info) => getTextFormat.formatLog(info)));
                break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
        
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;
    }
}