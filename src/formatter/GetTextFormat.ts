import { IGetOutputFormat } from "./interfaces/IGetOutputFormat";

 export class GetTextFormat implements IGetOutputFormat {   
    formatLog(info: any): string {
        let baseMsg = `${info.timestamp} ${info.level}`;
        let message = info.message;
        let contextMessage = info.context || '';
        let traceId = info.traceId || '';
        let id = info.id || '';
        let IPAddress = info.IPAddress || '';
        let parseStackMessage = '';

        if (info.parsedStack) {
            parseStackMessage = ` | trace: ${JSON.stringify(info.parsedStack)}`;
        }

        return `${baseMsg} traceId: ${traceId} HostIP: ${IPAddress} ${parseStackMessage} context: ${contextMessage} id: ${id} message: ${message}`;
    }
}