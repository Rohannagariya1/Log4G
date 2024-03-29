import { format} from "winston";
import { IFormatter } from "./interfaces/IFormatter";
import { LogFormat } from "./enums/logFormat.enum";
import { LogLevel } from "../logger/enums/LogLevel.enum";

export class FormatLogAdvance implements IFormatter { // Review: Rename class to be similar to TransportConfiguratorWIthBifircation
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
  
        // Review: Convert to switch case, and throw error in default case
        // Add JSON or printf formatting based on logFormat
        if (logFormat === LogFormat.JSON) {
            formatComponents.push(format.json());
        } else {
            formatComponents.push(format.printf((info) => {
                let baseMsg = `${info.timestamp} ${info.level}: ${info.message}`;
                if (info.context) {
                    baseMsg += ` | Context: ${JSON.stringify(info.context)}`;
                }
                if (info.parsedStack) {
                    baseMsg += ` | ParsedStack: ${JSON.stringify(info.parsedStack)}`;
                }
                return baseMsg;
                }
            ));
        }
  
        const loggerFormat = format.combine(...formatComponents);
        return loggerFormat;

    }
}


