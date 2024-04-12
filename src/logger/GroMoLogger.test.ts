import logger from './GroMoLogger';
import { TransporterType } from '../transport-config/enums/TransporterType.enum';
import { LogLevel } from './enums/LogLevel.enum';
import { LogFormat } from '../formatter/enums/logFormat.enum';
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

describe('GroMoLogger', () => {
  beforeEach(() => {


    logger.setConfig({
      enableStdout: true,
      nameOfProject: "testing",
      fileOptions: {
        enableFile: true,
        logLevel: LogLevel.INFO,
        datePattern: 'DD-MM-YYYY',
        zippedArchive: false,
        maxSize: '10k', 
        maxFiles: '1d'
      },
      logLevel: LogLevel.DEBUG,
      logFormat: LogFormat.TEXT,
      transporterType: TransporterType.SINGLE_FILE,
      overrideConsole: false,
      enableAccessLog: true
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();  // Restore mocks to avoid side effects between tests
  });

  it('logs info messages correctly', () => {
    const testMessage = "Test Info Message";
    logger.info(testMessage, "TestContext", "TestID");

    expect(logger.logger.log).toHaveBeenCalledWith(
      "info", 
      expect.anything(), 
      expect.objectContaining({
        message: testMessage,
        context: "TestContext",
        id: "TestID"
      })
    );
  });
});


describe('file logging', () => {
    beforeEach(() => {


        logger.setConfig({
          enableStdout: true,
          nameOfProject: "testing",
          fileOptions: {
            enableFile: true,
            logLevel: LogLevel.INFO,
            datePattern: 'DD-MM-YYYY',
            zippedArchive: false,
            maxSize: '10k', 
            maxFiles: '1d'
          },
          logLevel: LogLevel.DEBUG,
          logFormat: LogFormat.TEXT,
          transporterType: TransporterType.SINGLE_FILE,
          overrideConsole: false,
          enableAccessLog: true
        });
      });
    
    it('should write logs to a file', async () => {
      // Perform the action that triggers logging
      logger.info('Test Info Message','TestContext','TestID');
  
      // Wait for the file operations to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Read the log file
      const data = await readFile('APPLICATION_LOG/testing-logs.12-04-2024', 'utf8');
  
      // Parse the log file data if it's JSON, and assert its contents
      const logs = data.split('\n').filter((line: any) => line).map(JSON.parse);
      const logEntry = logs.find((log: { message: string; }) => log.message === 'Test Info Message');
  
      expect(logEntry).toBeDefined();
      expect(logEntry.context).toEqual('TestContext');
      expect(logEntry.id).toEqual('TestID');
    });
  
    // Cleanup after tests
    afterEach(() => {
      // Delete the log file or clear its contents
      fs.unlinkSync('APPLICATION_LOG/testing-logs.12-04-2024');
    });
  });