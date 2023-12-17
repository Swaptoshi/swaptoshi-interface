import React from 'react';
import ChainProvider from './ChainProvider';
import LiskPriceProvider from './LiskPriceProvider';
import TokenPickerProvider from './TokenPickerProvider';
import WalletModalProvider from './WalletModalProvider';
import { WalletConnectProvider } from './WalletConnectProvider';
import { ToastContainer } from 'react-toastify';
import { useTheme } from './ThemeProvider';

export default function AppContextProvider({ children }) {
	const [theme] = useTheme();

	return (
		<ChainProvider>
			<LiskPriceProvider>
				<WalletModalProvider>
					<WalletConnectProvider>
						<TokenPickerProvider>{children}</TokenPickerProvider>
					</WalletConnectProvider>
				</WalletModalProvider>
			</LiskPriceProvider>
			<ToastContainer position="bottom-right" theme={theme} />
		</ChainProvider>
	);
}
