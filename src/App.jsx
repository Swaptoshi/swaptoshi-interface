'use client';

import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Swap from './pages/Swap/Swap';
import Token from './pages/Tokens/Token';
import Pools from './pages/Pools/Pools';
import AddLiquidity from './pages/AddLiquidity/AddLiquidity';

import TokenDetails from './pages/TokenDetails/TokenDetails';
import { getSystemTheme } from './utils/theme/getSystemTheme';
import CreateToken from './pages/CreateToken/CreateToken';
import { useTheme } from './context/ThemeProvider';
import AppContextProvider from './context/AppContextProvider';
import CreatePool from './pages/CreatePool/CreatePool';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackComponent from './pages/Error/ErrorFallbackComponent';
import PositionDetails from './pages/PositionDetails/PositionDetails';
import IncreaseLiquidity from './pages/IncreaseLiquidity/IncreaseLiquidity';

function App() {
	const [theme] = useTheme();

	return (
		<div className="App" data-theme={theme === 'system' ? getSystemTheme() : theme}>
			<ErrorBoundary
				FallbackComponent={ErrorFallbackComponent}
				onReset={() => window.location.reload()}
			>
				<AppContextProvider>
					<Navbar />
					<Routes>
						<Route exact path="/" element={<Home />} />
						<Route path="/swap" element={<Swap />} />
						<Route path="/tokens" element={<Token />} />
						<Route path="/pools" element={<Pools />} />
						<Route path="/pools/create" element={<CreatePool />} />
						<Route path="/tokens/:id" element={<TokenDetails />} />
						<Route path="/tokens/create" element={<CreateToken />} />
						<Route path="/pools/mint" element={<AddLiquidity />} />
						<Route path="/pools/:id" element={<PositionDetails />} />
						<Route path="/pools/:id/add" element={<IncreaseLiquidity />} />
					</Routes>
				</AppContextProvider>
			</ErrorBoundary>
		</div>
	);
}

export default App;
