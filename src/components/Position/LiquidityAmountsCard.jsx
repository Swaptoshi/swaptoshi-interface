import React from 'react';
import SecondaryCard from '../Card/SecondaryCard';
import TokenAvatar from '../Avatar/token';
import AmountLabelTooltiped from '../Price/AmountLabelTooltiped';
import {
	getToken0PrincipalPercent,
	getToken1PrincipalPercent,
} from '../../utils/liquidity/principalPercentage';

export default function LiquidityAmountsCard({
	withPercent,
	withFee,
	position,
	value,
	token0,
	token1,
}) {
	const principalPercent = React.useMemo(() => {
		if (!position) return { token0: '0', token1: '0' };

		const token0 = (
			getToken0PrincipalPercent(position.poolTick, position.tickLower, position.tickUpper) * 100
		).toFixed(2);

		const token1 = (
			getToken1PrincipalPercent(position.poolTick, position.tickLower, position.tickUpper) * 100
		).toFixed(2);

		return {
			token0,
			token1,
		};
	}, [position]);

	return (
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
								amount={value[`principal${token0.slice(-1)}`]}
								decimal={position[`${token0}Decimal`]}
								symbol={position[`${token0}Symbol`]}
								limit={'0.001'}
								precision={2}
							/>
						</div>
						{withPercent && (
							<div
								className="Badge-sc-8f0f9d15-0 kjyCWx"
								style={{ marginLeft: '10px', width: '70px' }}
							>
								<div className="PositionPage__BadgeText-sc-f1e5edbd-2 kzEqix">
									{principalPercent[token0]}%
								</div>
							</div>
						)}
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
								amount={value[`principal${token1.slice(-1)}`]}
								decimal={position[`${token1}Decimal`]}
								symbol={position[`${token1}Symbol`]}
								limit={'0.001'}
								precision={2}
							/>
						</div>
						{withPercent && (
							<div
								className="Badge-sc-8f0f9d15-0 kjyCWx"
								style={{ marginLeft: '10px', width: '70px' }}
							>
								<div className="PositionPage__BadgeText-sc-f1e5edbd-2 kzEqix">
									{principalPercent[token1]}%
								</div>
							</div>
						)}
					</div>
				</div>
				{withFee && (
					<div
						className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi"
						style={{ marginTop: '4px' }}
					>
						<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
							<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">Fee Tier</div>
						</div>
						<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
							<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
								{position.fee / 10000}%
							</div>
						</div>
					</div>
				)}
			</div>
		</SecondaryCard>
	);
}
