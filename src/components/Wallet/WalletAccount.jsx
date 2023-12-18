import React from 'react';
import BalanceCard from './BalanceCard';
import { tryToast } from '../../utils/Toast/tryToast';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { getPrice } from '../../service/dex';
import { getLSKTokenId } from '../../utils/Token/getLSKTokenId';
import { useChain } from '../../context/ChainProvider';
import Loader from '../Loader';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import Card from '../Card/Card';
import { useLastBalance } from '../../context/LastBalanceProvider';

export default function WalletAccount({ show }) {
	const { senderPublicKey, balances } = useWalletConnect();
	const { chain, selectedService } = useChain();
	const { prices, fiatFormatter } = useLiskPrice();
	const { lastBalance, updateLastBalance } = useLastBalance();

	const [walletState, setWalletState] = React.useState();

	const currentWalletBalance = React.useMemo(
		() =>
			walletState
				? walletState
						.map(t => (t.priceLSK * Number(t.balance)) / 10 ** t.decimal)
						.reduce((a, b) => a + b, 0) * prices
				: 0,
		[prices, walletState],
	);

	const priceChange = React.useMemo(
		() =>
			lastBalance > 0
				? (((currentWalletBalance - lastBalance) / lastBalance) * 100).toFixed(2)
				: undefined,
		[currentWalletBalance, lastBalance],
	);

	const requestRef = React.useRef(false);

	React.useEffect(() => {
		if (currentWalletBalance > 0 && senderPublicKey) {
			updateLastBalance(currentWalletBalance);
		}
	}, [senderPublicKey, currentWalletBalance, updateLastBalance]);

	React.useEffect(() => {
		if (!show || requestRef.current) return;

		const run = async () => {
			if (balances === undefined) setWalletState([]);

			requestRef.current = true;
			const lskTokenId = await getLSKTokenId(chain);

			const accountBalances = [];
			for (let i = 0; i < balances.length; i++) {
				const price = await getPrice({
					baseTokenId: balances[i].tokenId,
					quoteTokenId: lskTokenId,
				});

				const accountBalance = {
					...balances[i],
					priceLSK: price.data.price,
				};

				accountBalances.push(accountBalance);
			}

			setWalletState(accountBalances);
			requestRef.current = false;
		};

		tryToast('Update wallet failed', run);
	}, [balances, chain, selectedService, senderPublicKey, show]);

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
				<div
					style={{
						fontSize: 12,
						fontWeight: 600,
						marginTop: '4px',
						display: priceChange === undefined ? 'none' : undefined,
						color: priceChange >= 0 ? 'var(--green)' : 'var(--red)',
					}}
				>
					{priceChange > 0 ? '+' : priceChange < 0 ? '-' : ''} {priceChange}% (
					{process.env.REACT_APP_LAST_BALANCE_UPDATE_INTERVAL})
				</div>
			</div>
			<div style={{ overflow: 'scroll', flex: 0.95 }}>
				{walletState.length > 0 ? (
					walletState.map(balance => <BalanceCard key={balance.tokenId} balance={balance} />)
				) : (
					<Card
						style={{
							padding: '16px',
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
							overflow: 'hidden',
							marginBottom: '16px',
							justifyContent: 'center',
						}}
					>
						No token to show
					</Card>
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
