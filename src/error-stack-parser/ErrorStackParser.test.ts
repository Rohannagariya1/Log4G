import { ErrorStackParser } from "./ErrorStackParser";



test('parses a valid stack trace correctly', () => {
    const stackTrace = `
Error at TestClass.testMethod (projectName/src/TestFile.ts:10:15)
    at MainClass.mainMethod (projectName/src/MainFile.ts:20:5)`;
    const parser = new ErrorStackParser();
    const result = parser.parse(stackTrace, "projectName");
    expect(result).toEqual({
        className: 'TestClass',
        methodName: 'testMethod',
        filePath: 'projectName/src/TestFile.ts:10',
        lineNumber: 10
    });
});