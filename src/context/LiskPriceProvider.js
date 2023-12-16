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
  const [fiatFormatter, setFiatFormatter] = React.useState();
  const [cryptoFormatter, setCryptoFormatter] = React.useState();
  const [currency, setCurrency] = React.useState("USD");
  const { selectedService } = useChain();

  React.useEffect(() => {
    setFiatFormatter(
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      })
    );
    setCryptoFormatter(
      new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 })
    );
  }, [currency]);

  React.useEffect(() => {
    const run = async () => {
      if (selectedService) {
        const market = await getLiskMarket(selectedService.serviceURLs);
        if (market && market.data && market.data.data.length > 0) {
          const price = market.data.data.find(
            (t) => t.from === "LSK" && t.to === currency.toUpperCase()
          );
          if (!price) setPrices(0);
          else setPrices(Number(price.rate));
        }
      }
    };

    tryToast(run);
    const updateLiskPriceInterval = setInterval(() => tryToast(run), 60000);

    return () => {
      clearInterval(updateLiskPriceInterval);
    };
  }, [currency, selectedService]);

  const context = React.useMemo(
    () => ({
      prices,
      setPrices,
      currency,
      setCurrency,
      fiatFormatter,
      cryptoFormatter,
    }),
    [cryptoFormatter, currency, fiatFormatter, prices]
  );

  return (
    <LiskPriceContext.Provider value={context}>
      {children}
    </LiskPriceContext.Provider>
  );
}
