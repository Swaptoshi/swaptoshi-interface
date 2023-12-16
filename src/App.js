import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
// import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Swap from "./pages/Swap/Swap";
import Token from "./pages/Tokens/Token";
import Pools from "./pages/Pools/Pools";
import Nfts from "./pages/Nfts/Nfts";
import PrivacyModal from "./utils/PrivacyModal/PrivacyModal";
import Vote from "./pages/Vote/Vote";
import LiquidityModal from "./utils/Modal/LiquidityModal";
import NftsDetails from "./pages/NftsDetails/NftsDetails";

import "./App.css";
import TokenDetails from "./components/TokenDetails/TokenDetails";

//Navbar Data
import { searchOptions } from "./service/navbar";
//Tokens Data
import { allTableData, updateTime, options, chartData } from "./service/tokens";
//Swap Modal Tokens Data
import { swapTokens } from "./service/swapTokens";

import SettingModal from "./utils/SettingModal/SettingModal";
import { allTableDataETH, allTableDataUSD } from "./service/nfts";
import CartModal from "./components/Cart/CartModal/CartModal";
import { WalletConnectProvider } from "./context/WalletConnectProvider";
import ChainProvider from "./context/ChainProvider";
import { getSystemTheme } from "./utils/Theme/getSystemTheme";
import LiskPriceProvider from "./context/LiskPriceProvider";
import CreateTokenModal from "./utils/Modal/CreateToken";
import { useTheme } from "./context/ThemeProvider";
import WalletModalProvider from "./context/WalletModal";
import { ToastContainer } from "react-toastify";

function App() {
  const [theme] = useTheme();
  //Add to Bag
  const [addToBag, setAddToBag] = useState([]);
  const [data, setData] = useState(null);

  //Swap Modal
  const [swapModal, setSwapModal] = useState(false);

  //Privacy Modal
  const [privacyModal, setPrivacyModal] = useState(false);

  //NFT BAG
  const [isCartVisible, setIsCartVisible] = useState(false);

  //Swap .js
  const [selectedToken, setSelectedToken] = useState(swapTokens[0]);
  const [selectedTokenSecond, setSelectedTokenSecond] = useState({
    symbol: "Select Token",
  });
  const [currentCurrencyId, setCurrentCurrencyId] = useState(null);

  const [liquidityTokenOne, setLiquidityTokenOne] = useState(swapTokens[0]);
  const [liquidityTokenTwo, setLiquidityTokenTwo] = useState({
    symbol: "Select Token",
  });
  const [isLiquidityTokenSelected, setIsLiquidityTokenSelected] =
    useState(false);

  const [currency, setCurrency] = useState("ETH");

  //Swap Modal Func
  const handleSwapModal = (currencyId) => {
    setSwapModal(true);
    setCurrentCurrencyId(currencyId);
    setIsLiquidityTokenSelected(currencyId);
  };

  //Cart
  const handleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  //Swaptokensfunc
  const handleTokenSelect = (token) => {
    const newToken = { ...token };
    if (currentCurrencyId === "ethId") {
      setSelectedToken(newToken);
    } else {
      setSelectedTokenSecond(newToken);
    }
    setSwapModal(false);
  };

  //SwapTokensfunc-liquidty0
  const handleLiquidityTokenSelect = (token) => {
    const newToken = { ...token };
    if (currentCurrencyId === "liquidityEthId") {
      setLiquidityTokenOne(newToken);
    } else {
      setLiquidityTokenTwo(newToken);
    }
    setSwapModal(false);
  };

  const handleSelect = (token, isLiquidity) => {
    if (isLiquidity) {
      handleLiquidityTokenSelect(token);
    } else {
      handleTokenSelect(token);
    }
    setSwapModal(false);
  };

  //Save bag item
  useEffect(() => {
    setAddToBag(
      localStorage.getItem("newBagItems")
        ? JSON.parse(localStorage.getItem("newBagItems"))
        : []
    );
  }, []);

  //Add to Bag
  // const onAddToBagHandler = (product) => {
  //   const existing = addToBag.find((item) => item.id === product.id);

  //   if (existing) {
  //     const newBagItems = addToBag.map((item) =>
  //       item.id === product.id
  //         ? { ...existing, qty: existing.qty + 1 }
  //         : item
  //     );
  //     setAddToBag(newBagItems);
  //     localStorage.setItem("newBagItems", JSON.stringify(newBagItems));
  //   } else {
  //     const matchingDataItem = data.find((item) => item.id === product.id);

  //     if (matchingDataItem) {
  //       const newBagItems = [
  //         ...addToBag,
  //         {
  //           ...product,
  //           qty: 1,
  //           selectedName: matchingDataItem.title,
  //         },
  //       ];
  //       setAddToBag(newBagItems);
  //       localStorage.setItem("newBagItems", JSON.stringify(newBagItems));
  //     } else {
  //       console.log('No matching data found for the product ID');
  //     }
  //   }
  // };

  const onAddToBagHandler = (product) => {
    const existing = addToBag.find((item) => item.id === product.id);
    if (existing) {
      const newBagItems = addToBag.map((item) =>
        item.id === product.id ? { ...existing, qty: existing.qty + 1 } : item
      );
      setAddToBag(newBagItems);
      localStorage.setItem("newBagItems", JSON.stringify(newBagItems));
    } else {
      const newBagItems = [...addToBag, { ...product, qty: 1 }];
      setAddToBag(newBagItems);
    }
  };
  const onRemoveBagItem = (product) => {
    const newBagItems = addToBag.filter((item) => item.id !== product.id);
    setAddToBag(newBagItems);
    localStorage.setItem("newBagItems", JSON.stringify(newBagItems));
  };

  return (
    <ChainProvider>
      <LiskPriceProvider>
        <WalletModalProvider>
          <WalletConnectProvider>
            <div
              className="App"
              data-theme={theme === "system" ? getSystemTheme() : theme}
            >
              <>
                <Navbar
                  searchOptions={searchOptions}
                  privacyModal={privacyModal}
                  setPrivacyModal={setPrivacyModal}
                  handleCart={handleCart}
                />
                <div>
                  <Routes>
                    <Route exact path="/" element={<Home />} />

                    <Route
                      path="/swap"
                      element={
                        <Swap
                          swapTokens={swapTokens}
                          handleSwapModal={handleSwapModal}
                          swapModal={swapModal}
                          setSwapModal={setSwapModal}
                          selectedToken={selectedToken}
                          setSelectedToken={setSelectedToken}
                          selectedTokenSecond={selectedTokenSecond}
                          setSelectedTokenSecond={setSelectedTokenSecond}
                          // handleTokenSelect={handleTokenSelect}
                          handleSelect={(token, isLiquidity) =>
                            handleSelect(token, isLiquidity)
                          }
                          currentCurrencyId={currentCurrencyId}
                        />
                      }
                      setCurrentCurrencyId={setCurrentCurrencyId}
                    />

                    <Route
                      path="/tokens"
                      element={
                        <Token
                          allTableData={allTableData}
                          updateTime={updateTime}
                          options={options}
                        />
                      }
                    />
                    <Route path="/pools" element={<Pools />} />
                    <Route
                      path="/nfts"
                      element={
                        <Nfts
                          data={data}
                          setData={setData}
                          addToBag={addToBag}
                          setAddToBag={setAddToBag}
                          onAddToBagHandler={onAddToBagHandler}
                          onRemoveBagItem={onRemoveBagItem}
                          isCartVisible={isCartVisible}
                          setIsCartVisible={setIsCartVisible}
                          handleCart={handleCart}
                          allTableDataETH={allTableDataETH}
                          allTableDataUSD={allTableDataUSD}
                          currency={currency}
                          setCurrency={setCurrency}
                        />
                      }
                    />
                    <Route
                      path="/tokens/:id"
                      element={
                        <TokenDetails
                          allTableData={allTableData}
                          chartData={chartData}
                        />
                      }
                    />
                    <Route
                      path="/nfts/:id"
                      element={
                        <NftsDetails
                          data={data}
                          setData={setData}
                          addToBag={addToBag}
                          setAddToBag={setAddToBag}
                          onAddToBagHandler={onAddToBagHandler}
                          onRemoveBagItem={onRemoveBagItem}
                          allTableDataETH={allTableDataETH}
                          allTableDataUSD={allTableDataUSD}
                          currency={currency}
                          setCurrency={setCurrency}
                          isCartVisible={isCartVisible}
                          setIsCartVisible={setIsCartVisible}
                        />
                      }
                    />

                    <Route path="/vote" element={<Vote />} />

                    <Route path="/privacy" element={<PrivacyModal />} />

                    <Route
                      path="/create-token"
                      element={<CreateTokenModal />}
                    />

                    <Route
                      path="/liquidity"
                      element={
                        <LiquidityModal
                          chartData={chartData}
                          swapTokens={swapTokens}
                          handleSwapModal={handleSwapModal}
                          swapModal={swapModal}
                          setSwapModal={setSwapModal}
                          currentCurrencyId={currentCurrencyId}
                          setCurrentCurrencyId={setCurrentCurrencyId}
                          handleSelect={(token, isLiquidity) =>
                            handleSelect(token, isLiquidity)
                          }
                          selectedToken={selectedToken}
                          liquidityTokenOne={liquidityTokenOne}
                          liquidityTokenTwo={liquidityTokenTwo}
                          isLiquidityTokenSelected={isLiquidityTokenSelected}
                        />
                      }
                    />

                    <Route path="/cart-modal" element={<CartModal />} />
                    <Route path="/settings" element={<SettingModal />} />
                  </Routes>
                </div>
              </>
            </div>
          </WalletConnectProvider>
        </WalletModalProvider>
      </LiskPriceProvider>
      <ToastContainer position="bottom-right" theme={theme} />
    </ChainProvider>
  );
}

export default App;
