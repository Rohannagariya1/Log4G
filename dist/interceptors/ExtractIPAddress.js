"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractIPAddress = void 0;
class ExtractIPAddress {
    extractIP(networkInterfaces) {
        const ipAddresses = {};
        for (const [interfaceName, interfaceDetails] of Object.entries(networkInterfaces)) {
            ipAddresses[interfaceName] = interfaceDetails.map(detail => detail.address);
        }
        return ipAddresses;
    }
}
exports.ExtractIPAddress = ExtractIPAddress;
