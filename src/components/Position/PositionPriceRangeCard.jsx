import React from 'react';
import PrimaryCard from '../Card/PrimaryCard';
import PositionPriceRange from './PositionPriceRange';

export default function PositionPriceRangeCard({ position, token0, token1, onSwitch }) {
	return (
		<PrimaryCard className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 dKubqp frINir iqvqwM">
			<PositionPriceRange
				withRange
				title={'Price range'}
				position={position}
				token0={token0}
				token1={token1}
				onSwitch={onSwitch}
			/>
		</PrimaryCard>
	);
}
