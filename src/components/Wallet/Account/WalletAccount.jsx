import React from 'react';
import BalanceCard from './BalanceCard';
import { tryToast } from '../../../utils/toast/tryToast';
import { useWalletConnect } from '../../../context/WalletConnectProvider';
import { getPrice } from '../../../service/dex';
import { getKLYTokenId } from '../../../utils/token/getKLYTokenId';
import { useChain } from '../../../context/ChainProvider';
import Loader from '../../Loader';
import { useKlayrPrice } from '../../../context/KlayrPriceProvider';
import SecondaryCard from '../../Card/SecondaryCard';
import { useLastBalance } from '../../../context/LastBalanceProvider';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../../../utils/config/env';

export default function WalletAccount({ show }) {
	const { senderPublicKey, balances, updateAccount } = useWalletConnect();
	const { chain, selectedService } = useChain();
	const { prices, fiatFormatter } = useKlayrPrice();
	const { getLastBalance, updateLastBalance } = useLastBalance();

	const [walletState, setWalletState] = React.useState();

	const currentWalletBalance = React.useMemo(
		() =>
			walletState && walletState.length > 0
				? walletState
						.map(t => (t.priceKLY * Number(t.balance)) / 10 ** t.decimal)
						.reduce((a, b) => a + b, 0) * prices
				: 0,
		[prices, walletState],
	);

	const priceChange = React.useMemo(
		() =>
			getLastBalance(chain) > 0
				? (((currentWalletBalance - getLastBalance(chain)) / getLastBalance(chain)) * 100).toFixed(
						2,
					)
				: undefined,
		[chain, currentWalletBalance, getLastBalance],
	);

	const requestRef = React.useRef(false);

	React.useEffect(() => {
		updateAccount();
	}, [updateAccount]);

	React.useEffect(() => {
		if (currentWalletBalance > 0 && senderPublicKey) {
			updateLastBalance(currentWalletBalance);
		}
	}, [senderPublicKey, currentWalletBalance, updateLastBalance]);

	const updateWallet = useDebouncedCallback(async () => {
		const run = async () => {
			if (balances === undefined) {
				setWalletState([]);
				return;
			}

			requestRef.current = true;
			const klyTokenId = await getKLYTokenId(chain);

			const accountBalances = [];
			for (let i = 0; i < balances.length; i++) {
				if (balances[i].balance === '0') continue;

				const price = await getPrice({
					baseTokenId: balances[i].tokenId,
					quoteTokenId: klyTokenId,
				});

				const accountBalance = {
					...balances[i],
					priceKLY: price.data.price,
				};

				accountBalances.push(accountBalance);
			}

			setWalletState(accountBalances);
			requestRef.current = false;
		};

		tryToast('Update wallet failed', run);
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		if (!show || requestRef.current) return;

		updateWallet();
	}, [balances, chain, selectedService, senderPublicKey, show, updateWallet]);

	return walletState !== undefined ? (
		<div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
			<div
				className="text"
				style={{
					fontSize: 23,
					maxWidth: '100%',
					marginTop: '8px',
					marginBottom: '24px',
				}}
			>
				<div
					style={{
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						whiteSpace: 'nowrap',
						maxWidth: '100%',
					}}
				>
					{fiatFormatter.format(currentWalletBalance.toFixed(2))}
				</div>
				{walletState && walletState.length > 0 && (
					<div
						style={{
							fontSize: 12,
							fontWeight: 600,
							marginTop: '4px',
							display: priceChange === undefined ? 'none' : undefined,
							color: priceChange >= 0 ? 'var(--green)' : 'var(--red)',
						}}
					>
						{priceChange > 0 ? '+' : ''}
						{fiatFormatter.format((currentWalletBalance - getLastBalance(chain)).toFixed(2))} (
						{priceChange > 0 ? '+' : ''}
						{priceChange}%)
					</div>
				)}
			</div>
			<div style={{ overflow: 'scroll', flex: 0.95 }}>
				{walletState.length > 0 ? (
					walletState.map(balance => <BalanceCard key={balance.tokenId} balance={balance} />)
				) : (
					<SecondaryCard
						style={{
							padding: '16px',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							overflow: 'hidden',
							marginBottom: '16px',
							justifyContent: 'center',
							color: 'var(--text-1)',
						}}
					>
						No token to show
					</SecondaryCard>
				)}
			</div>
		</div>
	) : (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				height: '100%',
				width: '100%',
			}}
		>
			<Loader size={40} />
		</div>
	);
}
