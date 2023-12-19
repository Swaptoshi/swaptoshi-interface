import React from 'react';
import useLocalStorage from 'use-local-storage';
import { useChain } from './ChainProvider';
import { getPreviousDayTimestamp } from '../utils/Time/getPreviousDayTimestamp';

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
			if (!Object.keys(lastBalanceUpdatedOn).includes(chain)) {
				const startOfToday = getPreviousDayTimestamp(0);
				setLastBalance(old => ({ ...old, [chain]: balance }));
				setLastBalanceUpdatedOn(old => ({ ...old, [chain]: startOfToday }));
				return;
			}
			if (new Date().getTime() - lastBalanceUpdatedOn[chain] > 2 * 86400000) {
				const startOfYesterday = getPreviousDayTimestamp(1);
				setLastBalance(old => ({ ...old, [chain]: balance }));
				setLastBalanceUpdatedOn(old => ({ ...old, [chain]: startOfYesterday }));
				return;
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
