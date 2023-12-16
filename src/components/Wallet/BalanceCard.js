import React from "react";
import Card from "../Card/Card";
import { tokenToColorHex } from "../../utils/Color/tokenToColor";

export default function BalanceCard() {
  const tokenId = "01576352";
  const [loaded, setIsLoaded] = React.useState(false);

  const onLoad = React.useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Card
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        margin: "16px 0px",
      }}
    >
      <div
        style={{
          borderRadius: 35,
          height: 35,
          width: 35,
          marginRight: "8px",
          overflow: "hidden",
        }}
      >
        <img
          alt={"logo"}
          src="https://raw.githubusercontent.com/LiskHQ/app-registry/main/devnet/Lisk/images/tokens/lisk.png"
          style={{
            height: "100%",
            width: "100%",
            display: loaded ? undefined : "none",
          }}
          onLoad={onLoad}
        />
        {!loaded && (
          <div
            style={{
              backgroundColor: `#${tokenToColorHex(tokenId)}`,
              height: "100%",
              width: "100%",
            }}
          />
        )}
      </div>

      <div>
        <div
          className="text"
          style={{ whiteSpace: "nowrap", fontSize: "16px" }}
        >
          12312321.2342342 LSK
        </div>
        <div
          className="text-accent"
          style={{ whiteSpace: "nowrap", fontSize: "12px" }}
        >
          ~12312312321 USD
        </div>
      </div>
    </Card>
  );
}
