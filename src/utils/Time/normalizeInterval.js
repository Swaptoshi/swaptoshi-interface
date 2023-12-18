import { intervalToSecond } from './intervalToSecond';

export const normalizeInterval = interval => {
	const nowInSecond = Math.floor(Date.now() / 1000);
	const second =
		intervalToSecond[interval] !== undefined
			? typeof interval === 'string'
				? intervalToSecond[interval]
				: typeof interval === 'number'
					? interval
					: 1
			: 1;
	return nowInSecond - (nowInSecond % second);
};
