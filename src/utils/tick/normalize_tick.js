export const normalizeTick = (tick, tickSpacing) => {
	if (tickSpacing) {
		const halfTickSpacing = Number(tickSpacing) / Number(2);
		let normalizator = Number(tick) % Number(tickSpacing);
		if (normalizator > halfTickSpacing) {
			normalizator = -(Number(tickSpacing) - normalizator);
		}
		return Number(tick) - normalizator;
	} else {
		return Number(tick);
	}
};
