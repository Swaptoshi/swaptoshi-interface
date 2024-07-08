import React from 'react';
import PriceRangeLabel from '../Price/PriceRangeLabel';
import { useChain } from '../../context/ChainProvider';
import TokenSwitchBox from '../SwitchBox/TokenSwitchBox';
import SecondaryCard from '../Card/SecondaryCard';
import { getMaxTick, getMinTick, getTickSpacing } from '../../utils/tick/price_tick';
import { INFINITE, ZERO } from '../../utils/constants/tick';
import { decodeTickPrice } from '../../utils/math/priceFormatter';

export default function PositionPriceRange({
	title,
	withRange,
	position,
	token0,
	token1,
	onSwitch,
}) {
	const { dexConfig } = useChain();

	const inverted = React.useMemo(() => token0 !== 'token0', [token0]);

	const tokenA = React.useMemo(() => {
		return position
			? {
					tokenId: position[token0],
					symbol: position[`${token0}Symbol`],
				}
			: undefined;
	}, [position, token0]);

	const tokenB = React.useMemo(() => {
		return position
			? {
					tokenId: position[token1],
					symbol: position[`${token1}Symbol`],
				}
			: undefined;
	}, [position, token1]);

	return (
		<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
			<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
				<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
					<div
						className="text__TextWrapper-sc-fbb4b34d-0 UseHi PositionPage__Label-sc-f1e5edbd-3 dJrcRo css-1sy3474"
						style={{ marginRight: '12px' }}
					>
						{title}
					</div>
					{withRange ? (
						<div className="hide-below-425">
							<PriceRangeLabel
								liquidity={position.liquidity}
								currentTick={position.poolTick}
								tickLower={position.tickLower}
								tickUpper={position.tickUpper}
							/>
						</div>
					) : null}
				</div>
				<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
					<div style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
						<TokenSwitchBox tokenA={tokenA} tokenB={tokenB} onSwitch={onSwitch} />
					</div>
				</div>
			</div>
			<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
				<SecondaryCard
					width="100%"
					className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 bUrEIp ebBnOr eNAPHe"
				>
					<div className="Column__AutoColumn-sc-ae7ea350-2 dtsltc">
						<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">Min price</span>
						<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-5dyzfr">
							{position.tickLower.toString() === getMinTick(getTickSpacing(position.fee, dexConfig))
								? ZERO
								: decodeTickPrice(
										inverted ? position.tickUpper : position.tickLower,
										position.token0Decimal,
										position.token1Decimal,
										inverted,
									)}
						</div>
						<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
							{position[`${token0}Symbol`]} per {position[`${token1}Symbol`]}
						</span>
					</div>
				</SecondaryCard>
				<span className="PositionPage__DoubleArrow-sc-f1e5edbd-6 cUfrhq">⟷</span>
				<SecondaryCard
					width="100%"
					className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 bUrEIp ebBnOr eNAPHe"
				>
					<div className="Column__AutoColumn-sc-ae7ea350-2 dtsltc">
						<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">Max price</span>
						<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-5dyzfr">
							{position.tickUpper.toString() === getMaxTick(getTickSpacing(position.fee, dexConfig))
								? INFINITE
								: decodeTickPrice(
										inverted ? position.tickLower : position.tickUpper,
										position.token0Decimal,
										position.token1Decimal,
										inverted,
									)}
						</div>
						<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
							{position[`${token0}Symbol`]} per {position[`${token1}Symbol`]}
						</span>
					</div>
				</SecondaryCard>
			</div>
			<SecondaryCard className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 hLDwqe ebBnOr eNAPHe">
				<div className="Column__AutoColumn-sc-ae7ea350-2 dtsltc">
					<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">Current price</span>
					<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-5dyzfr">
						{decodeTickPrice(
							position.poolTick,
							position.token0Decimal,
							position.token1Decimal,
							inverted,
						)}
					</div>
					<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
						{position[`${token0}Symbol`]} per {position[`${token1}Symbol`]}
					</span>
				</div>
			</SecondaryCard>
		</div>
	);
}
