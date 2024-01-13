import { decodeTickPrice, encodePriceSqrt } from '../math/priceFormatter';
import { MAX_TICK, MIN_TICK, getTickAtSqrtRatio } from '../tick/tick_math';

const normalizeTick = (tick, tickSpacing) => {
	if (tickSpacing) {
		const halfTickSpacing = Number(tickSpacing) / Number(2);
		let normalizator = Number(tick) % Number(tickSpacing);
		if (normalizator > halfTickSpacing) {
			normalizator = -(Number(tickSpacing) - normalizator);
		}
		return Number(tick) - normalizator;
	} else {
		return Number(tick);
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
	return decodeTickPrice((normalizeTick(tick, addedTick) + Number(addedTick)).toString());
};

export const subByTick = (price, subtractedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice((normalizeTick(tick, subtractedTick) - Number(subtractedTick)).toString());
};

export const getMinTick = tickSpacing => {
	const tick = normalizeTick(MIN_TICK, tickSpacing);
	return tick.toString();
};

export const getMinPrice = tickSpacing => {
	return decodeTickPrice(getMinTick(tickSpacing));
};

export const getMaxTick = tickSpacing => {
	const tick = normalizeTick(MAX_TICK, tickSpacing);
	return tick.toString();
};

export const getMAxPrice = tickSpacing => {
	return decodeTickPrice(getMaxTick(tickSpacing));
};
