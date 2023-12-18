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
	const [lastBalance, setLastBalance] = useLocalStorage(`last_balance`, {});
	const [lastBalanceUpdatedOn, setLastBalanceUpdatedOn] = useLocalStorage(
		`last_balance_updated_on`,
		{},
	);

	const getLastBalance = React.useCallback(
		chainPrefix => {
			return lastBalance[chainPrefix] ?? 0;
		},
		[lastBalance],
	);

	const updateLastBalance = React.useCallback(
		balance => {
			const now = normalizeInterval(process.env.REACT_APP_LAST_BALANCE_UPDATE_INTERVAL);
			if (Object.keys(lastBalanceUpdatedOn).length === 0 || lastBalanceUpdatedOn[chain] < now) {
				setLastBalance(old => ({ ...old, [chain]: balance }));
				setLastBalanceUpdatedOn(old => ({ ...old, [chain]: now }));
			}
		},
		[chain, lastBalanceUpdatedOn, setLastBalance, setLastBalanceUpdatedOn],
	);

	const clearLastBalance = React.useCallback(() => {
		setLastBalance({});
		setLastBalanceUpdatedOn({});
	}, [setLastBalance, setLastBalanceUpdatedOn]);

	const context = React.useMemo(
		() => ({
			getLastBalance,
			updateLastBalance,
			clearLastBalance,
		}),
		[getLastBalance, updateLastBalance, clearLastBalance],
	);

	return <LastBalanceContext.Provider value={context}>{children}</LastBalanceContext.Provider>;
}
