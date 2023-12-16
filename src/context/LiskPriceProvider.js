import React from "react";
import { useChain } from "./ChainProvider";
import { getLiskMarket } from "../service/market";
import { tryToast } from "../utils/Toast/tryToast";

const LiskPriceContext = React.createContext();

export function useLiskPrice() {
  return React.useContext(LiskPriceContext);
}

export default function LiskPriceProvider({ children }) {
  const [prices, setPrices] = React.useState([]);
  const { selectedService } = useChain();

  React.useEffect(() => {
    const run = async () => {
      if (selectedService) {
        const market = await getLiskMarket(selectedService.serviceURLs);
        if (market && market.data && market.data.data.length > 0)
          setPrices(market.data.data);
      }
    };

    const updateLiskPriceInterval = setInterval(tryToast(run), 60000);

    return () => {
      clearInterval(updateLiskPriceInterval);
    };
  }, [selectedService]);

  const context = React.useMemo(
    () => ({
      prices,
      setPrices,
    }),
    [prices]
  );

  return (
    <LiskPriceContext.Provider value={context}>
      {children}
    </LiskPriceContext.Provider>
  );
}
