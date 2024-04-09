"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractIPAddress = void 0;
class ExtractIPAddress {
    extractIP(networkInterfaces) {
        let enInterfaces = [];
        let ethInterfaces = [];
        for (const [interfaceName, _interfaceDetails] of Object.entries(networkInterfaces)) {
            if (interfaceName.startsWith('en')) {
                enInterfaces.push(interfaceName);
            }
            else if (interfaceName.startsWith('eth')) {
                ethInterfaces.push(interfaceName);
            }
        }
        // Sort interfaces by numerical suffix (if present)
        const sortByNumericalSuffix = (a, b) => {
            const numA = parseInt(a.match(/\d+$/) ? a.match(/\d+$/)[0] : '0', 10);
            const numB = parseInt(b.match(/\d+$/) ? b.match(/\d+$/)[0] : '0', 10);
            return numA - numB;
        };
        enInterfaces.sort(sortByNumericalSuffix);
        ethInterfaces.sort(sortByNumericalSuffix);
        // Select the preferred interface
        const preferredInterface = enInterfaces[0] || ethInterfaces[0];
        if (preferredInterface) {
            const ipAddress = networkInterfaces[preferredInterface].map(detail => detail.address);
            // Return the first IP address from the details of the preferred interface
            return ipAddress;
        }
        else {
            return null; // Return null when no matching interface is found
        }
    }
}
exports.ExtractIPAddress = ExtractIPAddress;
