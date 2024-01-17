import Decimal from 'decimal.js';
import { INFINITE, ZERO } from '../constants/tick';
import { decodeTickPrice } from '../math/priceFormatter';
import { getMaxTick, getMinTick } from '../tick/price_tick';

export const calculateAmount1 = (amount0, price, high, low, tickSpacing) => {
	const minPrice = decodeTickPrice(getMinTick(tickSpacing));
	const lowPrice =
		low === ZERO || new Decimal(low).lte(decodeTickPrice(getMinTick(tickSpacing))) ? minPrice : low;

	const maxPrice = decodeTickPrice(getMaxTick(tickSpacing));
	const highPrice =
		high === INFINITE || new Decimal(high).gte(decodeTickPrice(getMaxTick(tickSpacing)))
			? maxPrice
			: high;

	return (
		((amount0 * Math.sqrt(price) * Math.sqrt(highPrice)) /
			(Math.sqrt(highPrice) - Math.sqrt(price))) *
		(Math.sqrt(price) - Math.sqrt(lowPrice))
	);
};

export const calculateAmount0 = (amount1, price, high, low, tickSpacing) => {
	const minPrice = decodeTickPrice(getMinTick(tickSpacing));
	const lowPrice =
		low === ZERO || new Decimal(low).lte(decodeTickPrice(getMinTick(tickSpacing))) ? minPrice : low;

	const maxPrice = decodeTickPrice(getMaxTick(tickSpacing));
	const highPrice =
		high === INFINITE || new Decimal(high).gte(decodeTickPrice(getMaxTick(tickSpacing)))
			? maxPrice
			: high;

	return (
		((amount1 / (Math.sqrt(price) - Math.sqrt(lowPrice))) *
			(Math.sqrt(highPrice) - Math.sqrt(price))) /
		(Math.sqrt(price) * Math.sqrt(highPrice))
	);
};
