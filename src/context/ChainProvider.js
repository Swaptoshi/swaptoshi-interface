import React from "react";
import { serviceGET } from "../service/node";
import axios from "axios";

const ChainContext = React.createContext();

export function useChain() {
  return React.useContext(ChainContext);
}

export default function ChainProvider({ children }) {
  const [chain, setChain] = React.useState(process.env.REACT_APP_DEFAULT_CHAIN);
  const [availableService, setAvailableService] = React.useState();
  const [selectedService, setSelectedService] = React.useState();

  React.useEffect(() => {
    if (!availableService) return;
    for (let i = 0; i < availableService.length; i++) {
      if (availableService[i].chainID.substring(0, 2) === chain) {
        setSelectedService(availableService[i]);
        break;
      }
    }
  }, [availableService, chain]);

  React.useEffect(() => {
    const run = async () => {
      const fetchedService = [];

      const swaptoshiMetadata = await serviceGET(
        "/api/v3/blockchain/apps/meta?search=Swaptoshi",
        process.env.REACT_APP_SWAPTOSHI_SERVICE_URL
      );

      if (swaptoshiMetadata && swaptoshiMetadata.data) {
        for (const metadata of swaptoshiMetadata.data.data) {
          const service = {
            chainID: metadata.chainID,
            networkType: metadata.networkType,
            serviceURLs: "",
          };
          for (let i = 0; i < metadata.serviceURLs.length; i++) {
            try {
              await axios.get(
                `${metadata.serviceURLs[i].http}/api/v3/index/status`
              );
              service.serviceURLs = metadata.serviceURLs[i].http;
              break;
            } catch {}
          }
          fetchedService.push(service);
        }
      }

      setAvailableService(fetchedService);

      for (let i = 0; i < fetchedService.length; i++) {
        if (
          fetchedService[i].chainID.substring(0, 2) ===
          process.env.REACT_APP_DEFAULT_CHAIN
        ) {
          setSelectedService(fetchedService[i]);
          break;
        }
      }
    };

    run();
  }, []);

  const context = React.useMemo(
    () => ({
      chain,
      setChain,
      availableService,
      selectedService,
      setSelectedService,
    }),
    [availableService, chain, selectedService]
  );

  return (
    <ChainContext.Provider value={context}>{children}</ChainContext.Provider>
  );
}
