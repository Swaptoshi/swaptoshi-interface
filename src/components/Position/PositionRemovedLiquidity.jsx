import React from 'react';
import SecondaryCard from '../Card/SecondaryCard';
import TokenAvatar from '../Avatar/token';
import AmountLabelTooltiped from '../Price/AmountLabelTooltiped';

export default function PositionRemovedLiquidity({ position, value, removed }) {
	return (
		<SecondaryCard className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 cxkBqB fejats eNAPHe">
			<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
				<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
					<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
						<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
							Pooled {position[`token0Symbol`]}:
						</div>
					</div>
					<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
						<div
							className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug"
							style={{ marginRight: '8px' }}
						>
							<AmountLabelTooltiped
								amount={((BigInt(value.principal0) * BigInt(removed)) / BigInt(100)).toString()}
								decimal={position.token0Decimal}
								symbol={position.token0Symbol}
								limit={'0.001'}
								precision={2}
							/>
						</div>
						<TokenAvatar
							src={position.token0Logo}
							size={20}
							tokenId={position.token0}
							style={{ marginRight: '0.5rem' }}
						/>
					</div>
				</div>
				<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
					<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
						<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
							Pooled {position[`token1Symbol`]}:
						</div>
					</div>
					<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
						<div
							className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug"
							style={{ marginRight: '8px' }}
						>
							<AmountLabelTooltiped
								amount={((BigInt(value.principal1) * BigInt(removed)) / BigInt(100)).toString()}
								decimal={position.token1Decimal}
								symbol={position.token1Symbol}
								limit={'0.001'}
								precision={2}
							/>
						</div>
						<TokenAvatar
							src={position.token1Logo}
							size={20}
							tokenId={position.token1}
							style={{ marginRight: '0.5rem' }}
						/>
					</div>
				</div>
			</div>
		</SecondaryCard>
	);
}
