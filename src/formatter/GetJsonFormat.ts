import { IGetOutputFormat } from "./interfaces/IGetOutputFormat";
import { LogObject } from './models/ILogObject';
export class GetJsonFormat implements IGetOutputFormat {
    formatLog(info: any): string {
        const logObject: LogObject = {
            timestamp: info.timestamp,
            level: info.level
        };
    
        if (info.traceId) {
            logObject.traceId = info.traceId;
        }
        if (info.IPAddress) {
            logObject.IPAddress = info.IPAddress;
        }
        if(info.parsedStack){
            logObject.trace = info.parsedStack ? JSON.stringify(info.parsedStack) : '';
        }
        if(info.context){
            logObject.context = info.context || '';
        }
        if(info.id){
            logObject.id = info.id || '';
        }
        logObject.message = info.message
    
        
    
        return JSON.stringify(logObject);
    }
}