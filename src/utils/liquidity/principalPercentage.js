export const getToken0PrincipalPercent = (currentTick, tickLower, tickUpper) => {
	return Math.min(
		Math.max(
			1 - (Number(currentTick) - Number(tickLower)) / (Number(tickUpper) - Number(tickLower)),
			0,
		),
		1,
	);
};

export const getToken1PrincipalPercent = (currentTick, tickLower, tickUpper) => {
	return Math.min(
		Math.max(
			(Number(currentTick) - Number(tickLower)) / (Number(tickUpper) - Number(tickLower)),
			0,
		),
		1,
	);
};
