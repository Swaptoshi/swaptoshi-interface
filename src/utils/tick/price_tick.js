import { decodeTickPrice, encodePriceSqrt } from '../math/priceFormatter';
import { getTickAtSqrtRatio } from '../tick/tick_math';

export const normalizePriceByTick = (price, tickSpacing) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice((BigInt(tick) - (BigInt(tick) % BigInt(tickSpacing))).toString());
};

export const addByTick = (price, addedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice((BigInt(tick) + BigInt(addedTick)).toString());
};

export const subByTick = (price, subtractedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice((BigInt(tick) - BigInt(subtractedTick)).toString());
};
