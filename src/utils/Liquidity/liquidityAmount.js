export const calculateAmount1 = (amount0, price, high, low, inverted) => {
	const _price = inverted ? 1 / price : price;
	const _high = inverted ? 1 / high : high;
	const _low = inverted ? 1 / low : low;

	return (
		((amount0 * Math.sqrt(_price) * Math.sqrt(_high)) / (Math.sqrt(_high) - Math.sqrt(_price))) *
		(Math.sqrt(_price) - Math.sqrt(_low))
	);
};

export const calculateAmount0 = (amount1, price, high, low, inverted) => {
	const _price = inverted ? 1 / price : price;
	const _high = inverted ? 1 / high : high;
	const _low = inverted ? 1 / low : low;

	return (
		((amount1 / (Math.sqrt(_price) - Math.sqrt(_low))) * (Math.sqrt(_high) - Math.sqrt(_price))) /
		(Math.sqrt(_price) * Math.sqrt(_high))
	);
};
