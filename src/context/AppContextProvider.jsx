import React from 'react';
import ChainProvider from './ChainProvider';
import LiskPriceProvider from './LiskPriceProvider';
import TokenPickerProvider from './TokenPickerProvider';
import WalletModalProvider from './WalletModalProvider';
import { WalletConnectProvider } from './WalletConnectProvider';
import { ToastContainer } from 'react-toastify';
import { useTheme } from './ThemeProvider';
import LastBalanceProvider from './LastBalanceProvider';
import TransactionModalProvider from './TransactionModalProvider';

export default function AppContextProvider({ children }) {
	const [theme] = useTheme();

	return (
		<ChainProvider>
			<LiskPriceProvider>
				<WalletModalProvider>
					<WalletConnectProvider>
						<LastBalanceProvider>
							<TransactionModalProvider>
								<TokenPickerProvider>{children}</TokenPickerProvider>
							</TransactionModalProvider>
						</LastBalanceProvider>
					</WalletConnectProvider>
				</WalletModalProvider>
			</LiskPriceProvider>
			<ToastContainer
				stacked
				closeOnClick
				position="bottom-right"
				theme={theme}
				style={{ zIndex: 9999 }}
			/>
		</ChainProvider>
	);
}
