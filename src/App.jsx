import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Swap from './pages/Swap/Swap';
import Token from './pages/Tokens/Token';
import Pools from './pages/Pools/Pools';
import LiquidityModal from './pages/LiquidityModal/LiquidityModal';

import TokenDetails from './pages/TokenDetails/TokenDetails';
import { getSystemTheme } from './utils/theme/getSystemTheme';
import CreateTokenModal from './pages/CreateToken/CreateToken';
import { useTheme } from './context/ThemeProvider';
import AppContextProvider from './context/AppContextProvider';
import CreatePool from './pages/CreatePool/CreatePool';

function App() {
	const [theme] = useTheme();

	return (
		<div className="App" data-theme={theme === 'system' ? getSystemTheme() : theme}>
			<AppContextProvider>
				<Navbar />
				<Routes>
					<Route exact path="/" element={<Home />} />
					<Route path="/swap" element={<Swap />} />
					<Route path="/tokens" element={<Token />} />
					<Route path="/pools" element={<Pools />} />
					<Route path="/create-pool" element={<CreatePool />} />
					<Route path="/tokens/:id" element={<TokenDetails />} />
					<Route path="/create-token" element={<CreateTokenModal />} />
					<Route path="/liquidity" element={<LiquidityModal />} />
				</Routes>
			</AppContextProvider>
		</div>
	);
}

export default App;
