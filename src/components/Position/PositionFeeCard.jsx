import React from 'react';
import PrimaryCard from '../Card/PrimaryCard';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import PrimaryButton from '../Button/PrimaryButton';
import SecondaryCard from '../Card/SecondaryCard';
import TokenAvatar from '../Avatar/token';
import AmountLabelTooltiped from '../Price/AmountLabelTooltiped';
import Decimal from 'decimal.js';
import { useLiskPrice } from '../../context/LiskPriceProvider';

export default function PositionFeeCard({
	position,
	value,
	token0,
	token1,
	token0Price,
	token1Price,
}) {
	const { prices, fiatFormatter } = useLiskPrice();
	const { senderPublicKey } = useWalletConnect();

	const [feeFiat, setFeeFiat] = React.useState();

	const fetchFeeFiat = React.useCallback(async () => {
		setFeeFiat();

		let token0FeePrice = 0;
		let token1FeePrice = 0;

		const token0Fee = new Decimal(value[`fees${token0.slice(-1)}`]).div(
			10 ** Number(position[`${token0}Decimal`]),
		);
		const token1Fee = new Decimal(value[`fees${token1.slice(-1)}`]).div(
			10 ** Number(position[`${token1}Decimal`]),
		);

		if (token0Price) {
			token0FeePrice = new Decimal(token0Fee.mul(token0Price));
		}

		if (token1Price) {
			token1FeePrice = new Decimal(token1Fee.mul(token1Price));
		}

		const total = new Decimal(token0FeePrice).add(token1FeePrice).mul(prices).toFixed(2);
		setFeeFiat(fiatFormatter.format(total));
	}, [fiatFormatter, position, prices, token0, token0Price, token1, token1Price, value]);

	React.useEffect(() => {
		if (position && value && prices && token0 && token1) {
			fetchFeeFiat();
		}
	}, [fetchFeeFiat, position, prices, token0, token1, value]);

	return (
		<PrimaryCard className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 dKubqp frINir iqvqwM">
			<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw" style={{ width: '100%' }}>
				<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
					<div
						className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi"
						style={{ alignItems: 'flex-start' }}
					>
						<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
							<div className="text__TextWrapper-sc-fbb4b34d-0 UseHi PositionPage__Label-sc-f1e5edbd-3 dJrcRo css-1aulwug">
								Unclaimed fees
							</div>
							<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-cbqu6f">
								{feeFiat ? feeFiat : '-'}
							</div>
						</div>
						{senderPublicKey ? <PrimaryButton>Collect fees</PrimaryButton> : null}
					</div>
				</div>
				<SecondaryCard className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 cxkBqB fejats eNAPHe">
					<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
						<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
							<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
								<TokenAvatar
									src={position[`${token0}Logo`]}
									size={20}
									tokenId={position[token0]}
									style={{ marginRight: '0.5rem' }}
								/>
								<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
									{position[`${token0}Symbol`]}
								</div>
							</div>
							<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
								<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
									<AmountLabelTooltiped
										amount={value[`fees${token0.slice(-1)}`]}
										decimal={position[`${token0}Decimal`]}
										symbol={position[`${token0}Symbol`]}
										limit={'0.001'}
										precision={2}
									/>
								</div>
							</div>
						</div>
						<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
							<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
								<TokenAvatar
									src={position[`${token1}Logo`]}
									size={20}
									tokenId={position[token1]}
									style={{ marginRight: '0.5rem' }}
								/>
								<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
									{position[`${token1}Symbol`]}
								</div>
							</div>
							<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
								<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
									<AmountLabelTooltiped
										amount={value[`fees${token1.slice(-1)}`]}
										decimal={position[`${token1}Decimal`]}
										symbol={position[`${token1}Symbol`]}
										limit={'0.001'}
										precision={2}
									/>
								</div>
							</div>
						</div>
					</div>
				</SecondaryCard>
			</div>
		</PrimaryCard>
	);
}
