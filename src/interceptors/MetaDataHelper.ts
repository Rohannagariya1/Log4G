import { NetworkInterfaceInfo, networkInterfaces } from 'os';
import { IMetaDataHelper } from './interfaces/IMetaDataHelper';

class MetaDataHelper implements IMetaDataHelper {

  extractIP(networkInterfaces: { [interfaceName: string]: NetworkInterfaceInfo[] }):any {

    let enInterfaces: string[] = [];
    let ethInterfaces: string[] = [];
  

    for (const [interfaceName, _interfaceDetails] of Object.entries(networkInterfaces)) {
      if (interfaceName.startsWith('en')) {
        enInterfaces.push(interfaceName);
      } else if (interfaceName.startsWith('eth')) {
        ethInterfaces.push(interfaceName);
      }
    }
  
    // Sort interfaces by numerical suffix (if present)
    const sortByNumericalSuffix = (a: string, b: string): number => {
      const numA: number = parseInt(a.match(/\d+$/) ? a.match(/\d+$/)![0] : '0', 10);
      const numB: number = parseInt(b.match(/\d+$/) ? b.match(/\d+$/)![0] : '0', 10);
      return numA - numB;
    };
  
    enInterfaces.sort(sortByNumericalSuffix);
    ethInterfaces.sort(sortByNumericalSuffix);
  
    // Select the preferred interface
    const preferredInterface: string | undefined = enInterfaces[0] || ethInterfaces[0];
  
    if (preferredInterface) {
      const ipAddress = networkInterfaces[preferredInterface].map(detail => detail.address);
      // Return the first IP address from the details of the preferred interface
      return ipAddress;
    } else {
      return null; // Return null when no matching interface is found
    }
  }

  generateTraceId(): string {
    const epochTime = Math.floor(Date.now() / 1000).toString();
    const last4Digits = epochTime.substring(epochTime.length - 4);

    const fourRandomDigits = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    return `${last4Digits}${fourRandomDigits}`;
  }
}

const metaDataHelper = new MetaDataHelper();
export { metaDataHelper };