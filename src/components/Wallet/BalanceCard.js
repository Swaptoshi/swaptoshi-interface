import React from "react";
import Card from "../Card/Card";
import TokenAvatar from "../Avatar/token";

export default function BalanceCard() {
  const tokenId = "01576352";

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
      <TokenAvatar
        src={
          "https://raw.githubusercontent.com/LiskHQ/app-registry/main/devnet/Lisk/images/tokens/lisk.png"
        }
        style={{ marginRight: "8px" }}
        size={35}
        tokenId={tokenId}
      />

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
