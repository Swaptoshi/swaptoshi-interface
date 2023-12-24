const { getSqrtRatioAtTick } = require('../Tick/tick_math');

/* eslint-disable import/no-extraneous-dependencies */
const Decimal = require('decimal.js').default;
const BigNumber = require('bignumber.js').default;

Decimal.set({ toExpPos: 9999999, toExpNeg: -9999999 });
BigNumber.config({ EXPONENTIAL_AT: 999999, DECIMAL_PLACES: 40 });

const TEN = new BigNumber(10);
const FIVE_SIG_FIGS_POW = new Decimal(10).pow(5);
const Q128 = BigInt(0x100000000000000000000000000000000);

function decodePriceSqrt(sqrtRatioX96, decimalsToken0 = 8, decimalsToken1 = 8, inverse = false) {
	let ratio = new Decimal(sqrtRatioX96).div(2 ** 96).pow(2);

	if (decimalsToken1 < decimalsToken0) {
		ratio = ratio.mul(TEN.pow(decimalsToken0 - decimalsToken1).toString());
	} else if (decimalsToken0 < decimalsToken1) {
		ratio = ratio.div(TEN.pow(decimalsToken1 - decimalsToken0).toString());
	}

	if (inverse) {
		ratio = ratio.pow(-1);
	}

	if (ratio.lessThan(FIVE_SIG_FIGS_POW)) {
		return ratio.toPrecision(5);
	}

	return ratio.toString();
}

function encodePriceSqrt(reserve1, reserve0) {
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

function decodeTickPrice(tick, decimalsToken0 = 8, decimalsToken1 = 8, inverse = false) {
	const sqrtPriceX96 = getSqrtRatioAtTick(tick);
	return decodePriceSqrt(sqrtPriceX96, decimalsToken0, decimalsToken1, inverse);
}

module.exports = {
	decodeTickPrice,
	decodeFeeGrowth,
	decodePriceSqrt,
	encodeFeeGrowth,
	encodePriceSqrt,
};
