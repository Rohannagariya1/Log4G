import { IErrorStackParser } from "./interfaces/IErrorStackParser";
import { ParsedStackTrace } from "./types/ParsedStackTrace.type";

export class ErrorStackParser implements IErrorStackParser {

    /**
     * This function parses the stack trace and gives us meaningful information for our logger
     * like methodName, className, line number, and filepath as output
     * @param stackTrace 
     * @returns ParsedStackTrace
     */
    parse(stackTrace: string ,projectName:string) : string | null  {
        // if stack trace doesn't exist then the function exit with the undefined value for each info
        if (!stackTrace) {
            return null;
        }
    
        // here we have formatted stack trace and split it into lines
        const lines = stackTrace.split('\n');


        // Find the first line after the CustomLogger class as it will be the place where we have implemented the custom logger
        // we will do this by ignoring the custom logger info and error info which will be on top of stack trace
        const callerLine = lines?.find(line => 
            line.includes(projectName) && !line.includes('/node_modules/')
          )?.trim();
          
        // again if we fail to find the caller line than code will return the undefined value
        if (!callerLine) {
            return null;
        }

        return callerLine;
    }
}



