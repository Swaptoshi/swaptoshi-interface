import React from 'react';
import useLocalStorage from 'use-local-storage';
import { useChain } from './ChainProvider';
import { normalizeInterval } from '../utils/Time/normalizeInterval';

const LastBalanceContext = React.createContext();

export function useLastBalance() {
	return React.useContext(LastBalanceContext);
}

export default function LastBalanceProvider({ children }) {
	const { chain } = useChain();
	const [lastBalance, setLastBalance] = useLocalStorage(`last_balance_${chain}`, 0);
	const [lastBalanceUpdatedOn, setLastBalanceUpdatedOn] = useLocalStorage(
		`last_balance_${chain}_updated_on`,
		0,
	);

	const updateLastBalance = React.useCallback(
		balance => {
			const now = normalizeInterval(process.env.REACT_APP_LAST_BALANCE_UPDATE_INTERVAL);
			if (lastBalanceUpdatedOn < now) {
				setLastBalance(balance);
				setLastBalanceUpdatedOn(now);
			}
		},
		[lastBalanceUpdatedOn, setLastBalance, setLastBalanceUpdatedOn],
	);

	const clearLastBalance = React.useCallback(() => {
		setLastBalance(0);
		setLastBalanceUpdatedOn(0);
	}, [setLastBalance, setLastBalanceUpdatedOn]);

	const context = React.useMemo(
		() => ({
			lastBalance,
			updateLastBalance,
			clearLastBalance,
		}),
		[lastBalance, updateLastBalance, clearLastBalance],
	);

	return <LastBalanceContext.Provider value={context}>{children}</LastBalanceContext.Provider>;
}
