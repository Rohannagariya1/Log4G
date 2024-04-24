import { IGetOutputFormat } from "./interfaces/IGetOutputFormat";
import { LogObject } from './models/ILogObject';
export class GetJsonFormat implements IGetOutputFormat {
    formatLog(info: any): string {
        const logObject: LogObject = {
            timestamp: info.timestamp,
            level: info.level,
            path: info.path || '',
            trace: info.parsedStack ? JSON.stringify(info.parsedStack) : '',
            context: info.context || '',
            id: info.id || '',
            message: info.message
        };
    
        if (info.traceId) {
            logObject.traceId = info.traceId;
        }
    
        if (info.IPAddress) {
            logObject.IPAddress = info.IPAddress;
        }
    
        return JSON.stringify(logObject);
    }
}