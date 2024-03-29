import { LogLevel } from "../../logger/enums/LogLevel.enum";
import { LogFormat } from "../enums/logFormat.enum";

export interface IFormatter {
    formatter(logFormat : LogFormat , logLevel?  : LogLevel) : any;
}