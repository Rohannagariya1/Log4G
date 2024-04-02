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
                }));
                break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
        
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;
    }
}