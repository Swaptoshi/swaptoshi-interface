import React from "react";
import * as cryptography from "@liskhq/lisk-cryptography";
import BalanceCard from "./BalanceCard";
import { tryToast } from "../../utils/Toast/tryToast";
import { getTokenBalances } from "../../service/token";
import { useWalletConnect } from "../../context/WalletConnectProvider";
import { getFactoryTokenMeta } from "../../service/factory";
import { getDEXTokenCompact, getPrice } from "../../service/dex";
import { getLSKTokenId } from "../../utils/Token/getLSKTokenId";
import { useChain } from "../../context/ChainProvider";
import Loader from "../Loader";
import { useLiskPrice } from "../../context/LiskPriceProvider";

export default function WalletAccount({ show }) {
  const { senderPublicKey } = useWalletConnect();
  const { chain, selectedService } = useChain();
  const { prices, fiatFormatter } = useLiskPrice();

  const [walletState, setWalletState] = React.useState();
  const requestRef = React.useRef(false);

  React.useEffect(() => {
    if (!show || requestRef.current) return;

    const run = async () => {
      requestRef.current = true;
      const address = cryptography.address.getLisk32AddressFromPublicKey(
        Buffer.from(senderPublicKey, "hex")
      );
      const lskTokenId = await getLSKTokenId(chain);
      const balance = await getTokenBalances(
        { address },
        selectedService.serviceURLs
      );
      const tokenMeta = await getFactoryTokenMeta({
        registry: true,
        tokenIds: balance.data.data.map((t) => t.tokenID).join(","),
      });

      const accountBalances = [];
      for (let i = 0; i < balance.data.data.length; i++) {
        const price = await getPrice({
          baseTokenId: balance.data.data[i].tokenID,
          quoteTokenId: lskTokenId,
        });
        const meta = tokenMeta.data.data.find(
          (t) => t.tokenID === balance.data.data[i].tokenID
        );

        let symbol = meta ? meta.symbol : "???";
        let logo = meta ? meta.logo.png : undefined;
        let decimal = meta
          ? meta.denomUnits.find((t) => t.denom === symbol.toLowerCase())
              .decimals
          : undefined;

        if (!meta) {
          console.log(balance.data.data[i].tokenID);
          const dexMeta = await getDEXTokenCompact({
            search: balance.data.data[i].tokenID,
          });
          symbol = dexMeta ? dexMeta.data.data[0].symbol : "???";
          logo = dexMeta ? dexMeta.data.data[0].logo : "";
          decimal = dexMeta
            ? dexMeta.data.data[0].decimal
            : process.env.REACT_APP_DEFAULT_TOKEN_DECIMAL;
        }

        const accountBalance = {
          tokenId: balance.data.data[i].tokenID,
          balance: balance.data.data[i].availableBalance,
          symbol,
          logo,
          decimal,
          priceLSK: price.data.data.price,
        };

        accountBalances.push(accountBalance);
      }

      setWalletState(accountBalances);
      requestRef.current = false;
    };

    tryToast(run);
  }, [chain, selectedService, senderPublicKey, show]);

  return walletState !== undefined ? (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        className="text"
        style={{
          fontSize: 25,
          marginTop: "8px",
          marginBottom: "24px",
        }}
      >
        {fiatFormatter.format(
          (
            walletState
              .map((t) => (t.priceLSK * Number(t.balance)) / 10 ** t.decimal)
              .reduce((a, b) => a + b, 0) * prices
          ).toFixed(2)
        )}
      </div>
      <div style={{ overflow: "scroll", flex: 0.95 }}>
        {walletState.map((balance) => (
          <BalanceCard key={balance.tokenId} balance={balance} />
        ))}
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <Loader size={40} />
    </div>
  );
}
