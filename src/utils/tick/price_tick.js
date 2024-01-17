import { decodeTickPrice, encodePriceSqrt } from '../math/priceFormatter';
import { MAX_TICK, MIN_TICK, getTickAtSqrtRatio } from '../tick/tick_math';
import { normalizeTick } from './normalize_tick';

export const normalizePriceByTick = (price, tickSpacing) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = getTickAtSqrtRatio(sqrtPrice);
	return decodeTickPrice(normalizeTick(tick, tickSpacing).toString());
};

export const addByTick = (price, addedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = normalizeTick(getTickAtSqrtRatio(sqrtPrice), addedTick);
	const maxTick = getMaxTick(addedTick);
	return decodeTickPrice((tick + (tick.toString() === maxTick ? 0 : Number(addedTick))).toString());
};

export const subByTick = (price, subtractedTick) => {
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = normalizeTick(getTickAtSqrtRatio(sqrtPrice), subtractedTick);
	const minTick = getMinTick(subtractedTick);
	return decodeTickPrice(
		(tick - (tick.toString() === minTick ? 0 : Number(subtractedTick))).toString(),
	);
};

export const getMinTick = tickSpacing => {
	let tick = normalizeTick(MIN_TICK, tickSpacing);
	if (tick < Number(MIN_TICK)) tick += Number(tickSpacing);
	return tick.toString();
};

export const getMinPrice = tickSpacing => {
	return decodeTickPrice(getMinTick(tickSpacing));
};

export const getMaxTick = tickSpacing => {
	let tick = normalizeTick(MAX_TICK, tickSpacing);
	if (tick > Number(MAX_TICK)) tick -= Number(tickSpacing);
	return tick.toString();
};

export const getMAxPrice = tickSpacing => {
	return decodeTickPrice(getMaxTick(tickSpacing));
};
