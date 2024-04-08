import { NetworkInterfaceInfo, networkInterfaces } from 'os';
export class ExtractIPAddress {
   


      extractIP(networkInterfaces: { [interfaceName: string]: NetworkInterfaceInfo[] }) {
        const ipAddresses: { [interfaceName: string]: string[] } = {};
    
        for (const [interfaceName, interfaceDetails] of Object.entries(networkInterfaces)) {
          ipAddresses[interfaceName] = interfaceDetails.map(detail => detail.address);
        }
    
        return ipAddresses;
      }
    
}