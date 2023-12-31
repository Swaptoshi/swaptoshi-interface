const baseFeeMap = {
	[`dex:mint`]: 5100000,
};

export const getBaseFee = (module, command) => {
	if (baseFeeMap[`${module}:${command}`] !== undefined) return baseFeeMap[`${module}:${command}`];
	return 0;
};
