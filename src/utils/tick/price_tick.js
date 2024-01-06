import { decodeTickPrice, encodePriceSqrt } from '../math/priceFormatter';
import { getTickAtSqrtRatio } from '../tick/tick_math';

const normalizeTick = (tick, tickSpacing) => {
	return tickSpacing ? BigInt(tick) - (BigInt(tick) % BigInt(tickSpacing)) : BigInt(tick);
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
