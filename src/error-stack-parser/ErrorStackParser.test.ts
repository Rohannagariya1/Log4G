import { ErrorStackParser } from "./ErrorStackParser";




test('returns null if stack trace does not contain project name', () => {
    const stackTrace = `
Error at TestClass.testMethod (otherProject/src/TestFile.ts:10:15)
    at MainClass.mainMethod (otherProject/src/MainFile.ts:20:5)`;
    const parser = new ErrorStackParser();
    const result = parser.parse(stackTrace, "projectName");
    expect(result).toBeNull();
});

