import React from "react";
import { checkServiceNode } from "../service/node";
import { getBlockchainApps } from "../service/apps";
import { tryToast } from "../utils/Toast/tryToast";

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
      const swaptoshiMetadata = await getBlockchainApps();

      if (swaptoshiMetadata && swaptoshiMetadata.data) {
        for (const metadata of swaptoshiMetadata.data.data) {
          const service = {
            chainID: metadata.chainID,
            networkType: metadata.networkType,
            serviceURLs: "",
          };
          for (let i = 0; i < metadata.serviceURLs.length; i++) {
            if (await checkServiceNode(metadata.serviceURLs[i].http)) {
              service.serviceURLs = metadata.serviceURLs[i].http;
              break;
            }
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

    tryToast(run);
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
