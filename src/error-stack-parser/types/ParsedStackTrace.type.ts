export type ParsedStackTrace  = {
    filePath: string | null;
    lineNumber: number;
    className: string | null;
    methodName: string | null;
}