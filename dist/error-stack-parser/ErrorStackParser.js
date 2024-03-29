"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorStackParser = void 0;
class ErrorStackParser {
    /**
     * This function parses the stack trace and gives us meaningful information for our logger
     * like methodName, className, line number, and filepath as output
     * @param stackTrace
     * @returns ParsedStackTrace
     */
    parse(stackTrace) {
        // if stack trace doesn't exist then the function exit with the undefined value for each info
        if (!stackTrace) {
            return { filePath: null, lineNumber: -1, className: null, methodName: null };
        }
        // here we have formatted stack trace and split it into lines
        const lines = stackTrace.split('\n');
        /**
         * Review: I don't think you should `!line.includes('Logger')`. Use `lines[3].trim()` instead.
         */
        // Find the first line after the CustomLogger class as it will be the place where we have implemented the custom logger
        // we will do this by ignoring the custom logger info and error info which will be on top of stack trace
        const callerLine = lines.find(line => !line.includes('Logger') && !line.includes('Error'));
        // again if we fail to find the caller line than code will return the undefined value
        if (!callerLine) {
            return { filePath: null, lineNumber: -1, className: null, methodName: null };
        }
        // this is the regex to meet the desired patter for finding the class method that includes the class name and method name
        const classmethod = callerLine.match(/at (\w+)\.(\w+)/); // Review: Write test cases for this regex.
        let className = null;
        let methodName = null;
        if (classmethod) {
            [, className, methodName] = classmethod;
        }
        // Extract file path and line number from the caller line using the regex
        const matchResult = callerLine.match(/\((.*)\)/); // Review: Iska bhi test case
        // if we don't get the caller line then return the information we extracted and unkown field with null values
        if (!matchResult || !matchResult[1]) {
            return { filePath: null, lineNumber: -1, className, methodName };
        }
        // here we format our output in a more understandable format
        const parts = matchResult[1].split(':');
        const filePath = parts.slice(0, -1).join(':'); // Review: Add null checks here
        const lineNumber = parseInt(parts.slice(-1)[0]);
        return { filePath, lineNumber, className, methodName };
    }
}
exports.ErrorStackParser = ErrorStackParser;
