import { NetworkInterfaceInfo } from "os";

export interface IMetaDataHelper {
    extractIP(networkInterfaces: { [interfaceName: string]: NetworkInterfaceInfo[] }) : any;
    generateTraceId(): string;
}