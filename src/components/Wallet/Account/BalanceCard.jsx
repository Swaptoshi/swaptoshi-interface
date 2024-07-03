import React from 'react';
import SecondaryCard from '../../Card/SecondaryCard';
import TokenAvatar from '../../Avatar/token';
import { useKlayrPrice } from '../../../context/KlayrPriceProvider';

export default function BalanceCard({ balance }) {
	const { prices, fiatFormatter, cryptoFormatter } = useKlayrPrice();

	return (
		<SecondaryCard
			style={{
				padding: '16px',
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				overflow: 'hidden',
				marginBottom: '16px',
			}}
		>
			<TokenAvatar
				src={balance.logo}
				style={{ marginRight: '8px' }}
				size={35}
				tokenId={balance.tokenId}
			/>

			<div>
				<div className="text" style={{ whiteSpace: 'nowrap', fontSize: '16px' }}>
					{cryptoFormatter.format(balance.balance / 10 ** balance.decimal)} {balance.symbol}
				</div>
				<div className="text-accent" style={{ whiteSpace: 'nowrap', fontSize: '12px' }}>
					~
					{fiatFormatter.format(
						((balance.balance / 10 ** balance.decimal) * balance.priceKLY * prices).toFixed(2),
					)}
				</div>
			</div>
		</SecondaryCard>
	);
}
