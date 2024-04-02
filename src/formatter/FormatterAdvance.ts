import { format} from "winston";
import { IFormatter } from "./interfaces/IFormatter";
import { LogFormat } from "./enums/logFormat.enum";
import { LogLevel } from "../logger/enums/LogLevel.enum";

export class FormatLogWithBifurcation implements IFormatter { 
    formatter (logFormat: LogFormat , logLevel?: LogLevel): any {

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
                formatComponents.push(format.json());
                break;
            case LogFormat.TEXT:
                formatComponents.push(format.printf((info) => {
                let baseMsg = `${info.timestamp} ${info.level}: ${info.message}`;
                let contextMessage = info.context || ''; 
               let parseStackMessage = '';
                if (info.parsedStack) {
                    parseStackMessage = ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                }
                return baseMsg + contextMessage + parseStackMessage;
                }
            ));
            break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
  
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;

    }
}


