import { TransporterType } from "./enums/TransporterType.enum";
import { ITransportConfigurator } from "./interfaces/ITransportconfigurator";
import { TransportConfiguratorBasic } from "./TransportConfiguratorBasic";
import { TransportConfiguratorWithBifurcation } from "./TransportConfiguratorWithBifurcation";

export class TransportConfiguratorFactory {
    generate(type? : TransporterType): ITransportConfigurator {
        switch (type) {
            case TransporterType.SINGLE_FILE:
                return new TransportConfiguratorBasic();
            case TransporterType.BIFIRUCATED_BY_LOG_LEVEL:
                return new TransportConfiguratorWithBifurcation();
        default:
            return new TransportConfiguratorBasic();
        }
      }
  }