import { format} from "winston";
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
                formatComponents.push(format.printf((info) => { // Review: For clarity - Give type to info
                    let baseMsg = `${info.timestamp} ${info.level}: ${info.message}`;
                    if (info.context) {
                        baseMsg += ` | Context: ${JSON.stringify(info.context)}`; // Review: Get reviewed by Saket for mem leaks
                    }
                    if (info.parsedStack) {
                        baseMsg += ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                    }
                    return baseMsg;
                }));
                break;
            default:
                throw new Error("Unsupported Log Format: " + logFormat);
        }
        
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;
    }
}