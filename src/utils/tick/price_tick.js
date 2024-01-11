import { decodeTickPrice, encodePriceSqrt } from '../math/priceFormatter';
import { getTickAtSqrtRatio } from '../tick/tick_math';

const normalizeTick = (tick, tickSpacing) => {
	if (tickSpacing) {
		const halfTickSpacing = BigInt(tickSpacing) / BigInt(2);
		let normalizator = BigInt(tick) % BigInt(tickSpacing);
		if (normalizator > halfTickSpacing) {
			normalizator = -(BigInt(tickSpacing) - normalizator);
		}
		return BigInt(tick) - normalizator;
	} else {
		return BigInt(tick);
	}
};

export const normalizePriceByTick = (price, tickSpacing) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice(normalizeTick(tick, tickSpacing).toString());
};

export const addByTick = (price, addedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice((normalizeTick(tick, addedTick) + BigInt(addedTick)).toString());
};

export const subByTick = (price, subtractedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice((normalizeTick(tick, subtractedTick) - BigInt(subtractedTick)).toString());
};
