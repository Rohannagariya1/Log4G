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
        filePath: 'projectName/src/TestFile.ts:10:15',
        lineNumber: 10
    });
});
test('returns null if stack trace does not contain project name', () => {
    const stackTrace = `
Error at TestClass.testMethod (otherProject/src/TestFile.ts:10:15)
    at MainClass.mainMethod (otherProject/src/MainFile.ts:20:5)`;
    const parser = new ErrorStackParser();
    const result = parser.parse(stackTrace, "projectName");
    expect(result).toBeNull();
});
test('returns null if stack trace is malformed', () => {
    const stackTrace = "This is not a valid stack trace line.projectName";
    const parser = new ErrorStackParser();
    const result = parser.parse(stackTrace, "projectName");
    expect(result).toBeNull();
});
describe('regex pattern tests', () => {
    const stackTrace = "Error at TestClass.testMethod (projectName/src/TestFile.ts:10:15)";
    const parser = new ErrorStackParser();

    test('extracts className and methodName', () => {
        const result = parser.parse(stackTrace, "projectName");
        expect(result?.className).toBe('TestClass');
        expect(result?.methodName).toBe('testMethod');
    });

    test('extracts filePath and lineNumber', () => {
        const result = parser.parse(stackTrace, "projectName");
        expect(result?.filePath).toBe('projectName/src/TestFile.ts:10:15');
        expect(result?.lineNumber).toBe(10);
    });
});