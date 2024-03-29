export interface IErrorStackParser {
    parse(stackTrace: string): any; // Review: specify type of return value instead of any. Use an interface to create a type for it
}