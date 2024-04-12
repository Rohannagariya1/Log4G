import { ParsedStackTrace } from "../types/ParsedStackTrace.type";

export interface IErrorStackParser {
    parse(stackTrace: string,projectName : string): ParsedStackTrace | null; 
}