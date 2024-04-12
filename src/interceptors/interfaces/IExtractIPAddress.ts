import { NetworkInterfaceInfo } from "os";

export interface IExtractIPAddress {
    extractIP(networkInterfaces: { [interfaceName: string]: NetworkInterfaceInfo[] }) : any;
}