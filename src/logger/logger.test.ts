import { LogFormat } from '../formatter/enums/logFormat.enum';
import { TransporterType } from '../transport-config/enums/TransporterType.enum';
import { GroMoLogger } from './GroMoLogger';
import { LogLevel } from './enums/LogLevel.enum';
import { ILogger } from './interfaces/ILogger';

describe('Custom Logger', () => {
  let logger : ILogger;
 
  beforeEach(() => {

    logger = new GroMoLogger({
      enableStdout: true,
      fileOptions: {
        enableFile: true,
        nameOfProject: "testing",
        logLevel: LogLevel.INFO
      },
      logLevel: LogLevel.INFO,
      logFormat: LogFormat.TEXT,
      transporterType: TransporterType.SINGLE_FILE
    });
  });

  test('Override Console Methods', () => {
    const infoSpy = jest.spyOn(logger, 'info');
    const errorSpy = jest.spyOn(logger, 'error');
    const warnSpy = jest.spyOn(logger, 'warn');
    const debugSpy = jest.spyOn(logger, 'debug');

    console.log('Test log message');
    console.error('Test error message');
    console.warn('Test warn message');
    console.debug('Test debug message');

    // Check if the logger methods are called with the correct arguments
    expect(infoSpy).toHaveBeenCalledWith('Test log message');
    expect(errorSpy).toHaveBeenCalledWith('Test error message');
    expect(warnSpy).toHaveBeenCalledWith('Test warn message');
    expect(debugSpy).toHaveBeenCalledWith('Test debug message');

 

    // Restore the spies
    infoSpy.mockRestore();
    errorSpy.mockRestore();
    warnSpy.mockRestore();
    debugSpy.mockRestore();
  });
});

//   test('Logging Functionality', () => {
//     // Test logging messages with different log levels and types
//     // Verify that messages are correctly logged to the appropriate transports
//   });

//   test('Context Handling', () => {
//     // Test that context (e.g., method name, class name) is correctly determined and included in log messages
//   });

//   test('Transport Initialization', () => {
//     // Test that transports are properly initialized and configured based on options
//   });

//   test('Error Stack Parsing', () => {
//     // Test error stack parsing functionality, if applicable
//   });

//   test('Edge Cases and Error Handling', () => {
//     // Test edge cases and error handling scenarios
//   });
