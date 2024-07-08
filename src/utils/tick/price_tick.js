import Decimal from 'decimal.js';
import {
	decimalToString,
	decodeTickPrice,
	encodePriceSqrt,
	encodeTickPrice,
} from '../math/priceFormatter';
import { MAX_TICK, MIN_TICK, getTickAtSqrtRatio } from '../tick/tick_math';
import { normalizeTick } from './normalize_tick';

export const normalizePriceByTick = (price, tickSpacing, token0Decimal = 8, token1Decimal = 8) => {
	const tick = encodeTickPrice(price, tickSpacing, token0Decimal, token1Decimal);
	return decodeTickPrice(normalizeTick(tick, tickSpacing).toString(), token0Decimal, token1Decimal);
};

export const addByTick = (price, addedTick, _decimal, token0Decimal, token1Decimal) => {
	let multiplier = 1;
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = normalizeTick(getTickAtSqrtRatio(sqrtPrice), addedTick);
	const maxTick = getMaxTick(addedTick);

	let ret = decodeTickPrice(
		(tick + (tick.toString() === maxTick ? 0 : Number(addedTick))).toString(),
		token0Decimal,
		token1Decimal,
	);
	if (price === ret) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			const newTick = tick + Number(addedTick) * multiplier;
			if (newTick >= maxTick) break;

			ret = decodeTickPrice(newTick.toString(), token0Decimal, token1Decimal);

			if (price !== ret) break;
			multiplier += 1;
		}
	}

	return ret;
};

export const subByTick = (price, subtractedTick, decimal, token0Decimal, token1Decimal) => {
	let multiplier = 1;
	const minPrice = new Decimal(getMinPrice(decimal));
	const sqrtPrice = encodePriceSqrt(price, 1);
	const tick = normalizeTick(getTickAtSqrtRatio(sqrtPrice), subtractedTick);
	const minTick = getMinTick(subtractedTick);

	let ret = decodeTickPrice(
		(tick - (tick.toString() === minTick ? 0 : Number(subtractedTick))).toString(),
		token0Decimal,
		token1Decimal,
	);
	if (price === ret) {
		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (minPrice.gte(ret)) break;

			const newTick = tick - Number(subtractedTick) * multiplier;
			if (newTick <= minTick) break;

			ret = decodeTickPrice(newTick.toString(), token0Decimal, token1Decimal);

			if (price !== ret) break;
			multiplier += 1;
		}
	}

	return ret;
};

export const getMinTick = tickSpacing => {
	let tick = normalizeTick(MIN_TICK, tickSpacing);
	if (tick < Number(MIN_TICK)) tick += Number(tickSpacing);
	return tick.toString();
};

export const getMinPrice = decimal => {
	return decimalToString(new Decimal(10).pow(Number(decimal) * -1), decimal);
};

export const getMaxPrice = (tickSpacing, token0Decimal, token1Decimal) => {
	return decodeTickPrice(Number(getMaxTick(tickSpacing)), token0Decimal, token1Decimal);
};

export const getMaxTick = tickSpacing => {
	let tick = normalizeTick(MAX_TICK, tickSpacing);
	if (tick > Number(MAX_TICK)) tick -= Number(tickSpacing);
	return tick.toString();
};

export const getTickSpacing = (fee, dexConfig) => {
	if (dexConfig) {
		const tickSpacing = dexConfig.feeAmountTickSpacing.find(t => t[0] === fee.toString());
		if (tickSpacing) {
			return tickSpacing[1];
		}
	}
	return '0';
};
