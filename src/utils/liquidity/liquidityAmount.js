export const calculateAmount1 = (amount0, price, high, low) => {
	return (
		((amount0 * Math.sqrt(price) * Math.sqrt(high)) / (Math.sqrt(high) - Math.sqrt(price))) *
		(Math.sqrt(price) - Math.sqrt(low))
	);
};

export const calculateAmount0 = (amount1, price, high, low) => {
	return (
		((amount1 / (Math.sqrt(price) - Math.sqrt(low))) * (Math.sqrt(high) - Math.sqrt(price))) /
		(Math.sqrt(price) * Math.sqrt(high))
	);
};
