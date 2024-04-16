import logger from './GroMoLogger';
import { TransporterType } from '../transport-config/enums/TransporterType.enum';
import { LogLevel } from './enums/LogLevel.enum';
import { LogFormat } from '../formatter/enums/logFormat.enum';
import { Logger } from 'winston';
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

describe('GroMoLogger', () => {
    let spyLog: jest.SpyInstance<Logger, [level: string, message: any], any>;
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
        maxDuration: '1d'
      },
      logLevel: LogLevel.DEBUG,
      logFormat: LogFormat.TEXT,
      transporterType: TransporterType.SINGLE_FILE,
      overrideConsole: false,
      enableAccessLog: true
    });
});
    afterEach(() => {
  
  });

  

 
  it('logs a simple info message', () => {
    const spy = jest.spyOn(logger, 'info');
    logger.info("Hello, world!");
    expect(spy).toHaveBeenCalledWith("Hello, world!");
});
it('logs a simple warn message', () => {
    const spy = jest.spyOn(logger, 'warn');
    logger.warn("Hello, world!");
    expect(spy).toHaveBeenCalledWith("Hello, world!");
});
it('logs a simple error message', () => {
    const spy = jest.spyOn(logger, 'error');
    logger.error("Hello, world!");
    expect(spy).toHaveBeenCalledWith("Hello, world!");
});
it('logs a simple debug message', () => {
    const spy = jest.spyOn(logger, 'debug');
    logger.debug("Hello, world!");
    expect(spy).toHaveBeenCalledWith("Hello, world!");
});
it('logs a simple http message', () => {
    const spy = jest.spyOn(logger, 'http');
    logger.http("Hello, world!");
    expect(spy).toHaveBeenCalledWith("Hello, world!");
});
it('logs a simple verbose message', () => {
    const spy = jest.spyOn(logger, 'verbose');
    logger.verbose("Hello, world!");
    expect(spy).toHaveBeenCalledWith("Hello, world!");
});




});

