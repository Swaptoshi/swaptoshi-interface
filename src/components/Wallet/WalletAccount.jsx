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

export default function WalletAccount({ show }) {
	const { senderPublicKey, balances } = useWalletConnect();
	const { chain, selectedService } = useChain();
	const { prices, fiatFormatter } = useLiskPrice();

	const [walletState, setWalletState] = React.useState();
	const requestRef = React.useRef(false);

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
					fontSize: 25,
					marginTop: '8px',
					marginBottom: '24px',
				}}
			>
				{fiatFormatter.format(
					(
						walletState
							.map(t => (t.priceLSK * Number(t.balance)) / 10 ** t.decimal)
							.reduce((a, b) => a + b, 0) * prices
					).toFixed(2),
				)}
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
