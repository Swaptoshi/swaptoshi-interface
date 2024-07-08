const { INFINITE, ZERO } = require('../constants/tick');
const { normalizeTick } = require('../tick/normalize_tick');
const { MAX_SQRT_RATIO, MIN_SQRT_RATIO } = require('../tick/tick_math');

/* eslint-disable import/no-extraneous-dependencies */
const Decimal = require('decimal.js').default;
const BigNumber = require('bignumber.js').default;

Decimal.set({ toExpPos: 9999999, toExpNeg: -9999999 });
BigNumber.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const TEN = new BigNumber(10);
const FIVE_SIG_FIGS_POW = new Decimal(10).pow(5);
const Q128 = BigInt(0x100000000000000000000000000000000);

function decodePriceSqrt(
	sqrtRatioX96,
	decimalsToken0 = 8,
	decimalsToken1 = 8,
	inverse = false,
	disableFiveSigPrevision = false,
) {
	const ratioNum = new Decimal(sqrtRatioX96)
		.div(2 ** 96)
		.pow(2)
		.toPrecision(5);
	let ratio = new Decimal(ratioNum);

	if (decimalsToken1 < decimalsToken0) {
		ratio = ratio.mul(TEN.pow(decimalsToken0 - decimalsToken1).toString());
	} else if (decimalsToken0 < decimalsToken1) {
		ratio = ratio.div(TEN.pow(decimalsToken1 - decimalsToken0).toString());
	}

	if (inverse) {
		ratio = ratio.pow(-1);
	}

	if (!disableFiveSigPrevision && ratio.lessThan(FIVE_SIG_FIGS_POW)) {
		return ratio.toPrecision(5);
	}

	return ratio.toString();
}

function encodePriceSqrt(reserve1, reserve0) {
	if (reserve1 === INFINITE || reserve0 === INFINITE) {
		return MAX_SQRT_RATIO;
	}
	if (reserve1 === ZERO || reserve0 === ZERO) {
		return MIN_SQRT_RATIO;
	}
	return new Decimal(reserve1.toString())
		.div(reserve0)
		.sqrt()
		.mul(new Decimal(2).pow(96))
		.toFixed(0);
}

function encodeFeeGrowth(feeGrowth, liquidity) {
	return ((BigInt(feeGrowth) * Q128) / BigInt(liquidity)).toString();
}

function decodeFeeGrowth(feeGrowthX128, liquidity) {
	return ((BigInt(feeGrowthX128) * BigInt(liquidity)) / Q128).toString();
}

function decodeTickPrice(tick, token0Decimals = 8, token1Decimals = 8, invert = false) {
	let price = new Decimal(1.0001)
		.pow(tick)
		.mul(new Decimal(10).pow(Number(token1Decimals) - Number(token0Decimals)));

	if (invert) {
		price = price.pow(-1);
	}

	return price.toDecimalPlaces(invert ? Number(token1Decimals) : Number(token0Decimals)).toString();
}

function encodeTickPrice(
	price,
	tickSpacing,
	token0Decimals = 8,
	token1Decimals = 8,
	invert = false,
) {
	let _price = price;
	if (invert) {
		_price = new Decimal(price)
			.pow(-1)
			.toDecimalPlaces(invert ? Number(token1Decimals) : Number(token0Decimals))
			.toString();
	}

	let adjustedPrice = new Decimal(_price)
		.div(new Decimal(10).pow(Number(token1Decimals) - Number(token0Decimals)))
		.toNumber();
	let tick = Math.log(adjustedPrice) / Math.log(1.0001);
	tick = normalizeTick(tick, Number(tickSpacing));

	return Math.round(tick);
}

function inversePriceSqrt(sqrtRatioX96, decimalsToken0 = 8, decimalsToken1 = 8) {
	const price = decodePriceSqrt(sqrtRatioX96, decimalsToken0, decimalsToken1, true, true);
	return encodePriceSqrt(price, 1);
}

function decimalToString(value, decimal) {
	return new Decimal(value).toDecimalPlaces(decimal).toString();
}

module.exports = {
	decimalToString,
	encodeTickPrice,
	inversePriceSqrt,
	decodeTickPrice,
	decodeFeeGrowth,
	decodePriceSqrt,
	encodeFeeGrowth,
	encodePriceSqrt,
};
