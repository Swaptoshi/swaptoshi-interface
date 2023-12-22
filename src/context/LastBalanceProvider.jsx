import React from 'react';
import useLocalStorage from 'use-local-storage';
import { useChain } from './ChainProvider';
import { getPreviousDayTimestamp } from '../utils/Time/getPreviousDayTimestamp';
import { useWalletConnect } from './WalletConnectProvider';

const LastBalanceContext = React.createContext();

export function useLastBalance() {
	return React.useContext(LastBalanceContext);
}

export default function LastBalanceProvider({ children }) {
	const { chain } = useChain();
	const { senderPublicKey } = useWalletConnect();
	const [lastBalance, setLastBalance] = useLocalStorage(`last_balance`, {});
	const [lastBalanceUpdatedOn, setLastBalanceUpdatedOn] = useLocalStorage(
		`last_balance_updated_on`,
		{},
	);

	const getLastBalance = React.useCallback(
		chainPrefix => {
			return lastBalance[`${chainPrefix}:${senderPublicKey}`] ?? 0;
		},
		[lastBalance, senderPublicKey],
	);

	const updateLastBalance = React.useCallback(
		balance => {
			if (!Object.keys(lastBalanceUpdatedOn).includes(`${chain}:${senderPublicKey}`)) {
				const startOfToday = getPreviousDayTimestamp(0);
				setLastBalance(old => ({ ...old, [`${chain}:${senderPublicKey}`]: balance }));
				setLastBalanceUpdatedOn(old => ({ ...old, [`${chain}:${senderPublicKey}`]: startOfToday }));
				return;
			}
			if (
				new Date().getTime() - lastBalanceUpdatedOn[`${chain}:${senderPublicKey}`] >
				2 * 86400000
			) {
				const startOfYesterday = getPreviousDayTimestamp(1);
				setLastBalance(old => ({ ...old, [`${chain}:${senderPublicKey}`]: balance }));
				setLastBalanceUpdatedOn(old => ({
					...old,
					[`${chain}:${senderPublicKey}`]: startOfYesterday,
				}));
				return;
			}
		},
		[chain, lastBalanceUpdatedOn, senderPublicKey, setLastBalance, setLastBalanceUpdatedOn],
	);

	const resetLastBalance = React.useCallback(() => {
		setLastBalance({});
		setLastBalanceUpdatedOn({});
	}, [setLastBalance, setLastBalanceUpdatedOn]);

	const clearCurrentAccountLastBalance = React.useCallback(() => {
		setLastBalance(old => {
			const state = old;
			delete state[`${chain}:${senderPublicKey}`];
			return state;
		});
		setLastBalanceUpdatedOn(old => {
			const state = old;
			delete state[`${chain}:${senderPublicKey}`];
			return state;
		});
	}, [chain, senderPublicKey, setLastBalance, setLastBalanceUpdatedOn]);

	const context = React.useMemo(
		() => ({
			getLastBalance,
			updateLastBalance,
			resetLastBalance,
			clearCurrentAccountLastBalance,
		}),
		[getLastBalance, updateLastBalance, resetLastBalance, clearCurrentAccountLastBalance],
	);

	return <LastBalanceContext.Provider value={context}>{children}</LastBalanceContext.Provider>;
}
