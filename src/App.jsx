import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
// import Footer from "./components/Footer/Footer";
import Home from './pages/Home/Home';
import Swap from './pages/Swap/Swap';
import Token from './pages/Tokens/Token';
import Pools from './pages/Pools/Pools';
import LiquidityModal from './pages/LiquidityModal/LiquidityModal';

import './App.css';
import TokenDetails from './components/TokenDetails/TokenDetails';

//Navbar Data
import { searchOptions } from './service/navbar';
//Tokens Data
import { allTableData, updateTime, options, chartData } from './service/tokens';
//Swap Modal Tokens Data
import { swapTokens } from './service/swapTokens';

import { getSystemTheme } from './utils/Theme/getSystemTheme';
import CreateTokenModal from './pages/CreateToken/CreateToken';
import { useTheme } from './context/ThemeProvider';
import AppContextProvider from './context/AppContextProvider';

function App() {
	const [theme] = useTheme();

	//Swap Modal
	const [swapModal, setSwapModal] = useState(false);

	//Privacy Modal
	const [privacyModal, setPrivacyModal] = useState(false);

	//NFT BAG
	const [isCartVisible, setIsCartVisible] = useState(false);

	//Swap .js
	const [selectedToken, setSelectedToken] = useState(swapTokens[0]);
	const [selectedTokenSecond, setSelectedTokenSecond] = useState({
		symbol: 'Select Token',
	});
	const [currentCurrencyId, setCurrentCurrencyId] = useState(null);

	const [liquidityTokenOne, setLiquidityTokenOne] = useState(swapTokens[0]);
	const [liquidityTokenTwo, setLiquidityTokenTwo] = useState({
		symbol: 'Select Token',
	});
	const [isLiquidityTokenSelected, setIsLiquidityTokenSelected] = useState(false);

	//Swap Modal Func
	const handleSwapModal = currencyId => {
		setSwapModal(true);
		setCurrentCurrencyId(currencyId);
		setIsLiquidityTokenSelected(currencyId);
	};

	//Cart
	const handleCart = () => {
		setIsCartVisible(!isCartVisible);
	};

	//Swaptokensfunc
	const handleTokenSelect = token => {
		const newToken = { ...token };
		if (currentCurrencyId === 'ethId') {
			setSelectedToken(newToken);
		} else {
			setSelectedTokenSecond(newToken);
		}
		setSwapModal(false);
	};

	//SwapTokensfunc-liquidty0
	const handleLiquidityTokenSelect = token => {
		const newToken = { ...token };
		if (currentCurrencyId === 'liquidityEthId') {
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

	return (
		<div className="App" data-theme={theme === 'system' ? getSystemTheme() : theme}>
			<AppContextProvider>
				<Navbar
					searchOptions={searchOptions}
					privacyModal={privacyModal}
					setPrivacyModal={setPrivacyModal}
					handleCart={handleCart}
				/>
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
								handleSelect={(token, isLiquidity) => handleSelect(token, isLiquidity)}
								currentCurrencyId={currentCurrencyId}
							/>
						}
						setCurrentCurrencyId={setCurrentCurrencyId}
					/>

					<Route
						path="/tokens"
						element={
							<Token allTableData={allTableData} updateTime={updateTime} options={options} />
						}
					/>
					<Route path="/pools" element={<Pools />} />
					<Route
						path="/tokens/:id"
						element={<TokenDetails allTableData={allTableData} chartData={chartData} />}
					/>

					<Route path="/create-token" element={<CreateTokenModal />} />

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
								handleSelect={(token, isLiquidity) => handleSelect(token, isLiquidity)}
								selectedToken={selectedToken}
								liquidityTokenOne={liquidityTokenOne}
								liquidityTokenTwo={liquidityTokenTwo}
								isLiquidityTokenSelected={isLiquidityTokenSelected}
							/>
						}
					/>
				</Routes>
			</AppContextProvider>
		</div>
	);
}

export default App;