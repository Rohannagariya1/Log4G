import { format} from "winston";
import { IFormatter } from "./interfaces/IFormatter";
import { LogFormat } from "./enums/logFormat.enum";
import { LogLevel } from "../logger/enums/LogLevel.enum";
import { GetJsonFormat } from "./GetJsonFormat";
import { GetTextFormat } from "./GetTextFormat";

export class FormatLogWithBifurcation implements IFormatter { 
    formatter (logFormat?: LogFormat , logLevel?: LogLevel): any {
        let getJsonFormat : GetJsonFormat = new GetJsonFormat();
        let getTextFormat : GetTextFormat = new GetTextFormat();
        if (!logFormat) {
            logFormat = LogFormat.TEXT;
          }
        // This function filters logs and only keeps ones that are of specified log level
        const filterLevel = (level: LogLevel) => format((info) => {
            return info.level === level ? info : false;
        })();
 
        let formatComponents = [
            format.timestamp(),
        ];
  
        // Optionally add filterLevel if logLevel is provided and not empty
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


