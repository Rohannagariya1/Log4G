import { ILoggerOptions } from "../../logger/models/ILoggerOptions";
export interface ITransportConfigurator {
    configureTransports(options: ILoggerOptions): any[];

  }