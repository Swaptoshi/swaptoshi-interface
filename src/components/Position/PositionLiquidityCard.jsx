import React from 'react';
import PrimaryCard from '../Card/PrimaryCard';
import Decimal from 'decimal.js';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import LiquidityAmountsCard from './LiquidityAmountsCard';

export default function PositionLiquidityCard({
	position,
	value,
	token0,
	token1,
	token0Price,
	token1Price,
}) {
	const { prices, fiatFormatter } = useLiskPrice();
	const [liquidityFiat, setLiquidityFiat] = React.useState();

	const fetchLiquidityFiat = React.useCallback(async () => {
		setLiquidityFiat();

		let token0ValuePrice = new Decimal(0);
		let token1ValuePrice = new Decimal(0);

		const token0Value = new Decimal(value[`principal${token0.slice(-1)}`]).div(
			10 ** Number(position[`${token0}Decimal`]),
		);
		const token1Value = new Decimal(value[`principal${token1.slice(-1)}`]).div(
			10 ** Number(position[`${token1}Decimal`]),
		);

		if (token0Price) {
			token0ValuePrice = new Decimal(token0Value.mul(token0Price));
		}

		if (token1Price) {
			token1ValuePrice = new Decimal(token1Value.mul(token1Price));
		}

		const total = new Decimal(token0ValuePrice).add(token1ValuePrice).mul(prices).toFixed(2);
		setLiquidityFiat(fiatFormatter.format(total));
	}, [fiatFormatter, position, prices, token0, token0Price, token1, token1Price, value]);

	React.useEffect(() => {
		if (position && value && prices && token0 && token1) {
			fetchLiquidityFiat();
		}
	}, [fetchLiquidityFiat, position, prices, token0, token1, value]);

	return (
		<PrimaryCard className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 dKubqp frINir iqvqwM">
			<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw" style={{ width: '100%' }}>
				<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
					<div className="text__TextWrapper-sc-fbb4b34d-0 UseHi PositionPage__Label-sc-f1e5edbd-3 dJrcRo css-1aulwug text">
						Liquidity
					</div>
					<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-cbqu6f">
						{liquidityFiat ? liquidityFiat : '-'}
					</div>
				</div>
				<LiquidityAmountsCard
					withPercent
					position={position}
					value={value}
					token0={token0}
					token1={token1}
				/>
			</div>
		</PrimaryCard>
	);
}
