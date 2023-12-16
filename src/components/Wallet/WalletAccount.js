import React from "react";
import BalanceCard from "./BalanceCard";

export default function WalletAccount() {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        className="text"
        style={{
          fontSize: 30,
          marginTop: "16px",
          marginBottom: "16px",
        }}
      >
        $123.123
      </div>
      <div style={{ overflow: "scroll", flex: 0.95 }}>
        <BalanceCard />
      </div>
    </div>
  );
}
