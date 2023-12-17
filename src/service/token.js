import { serviceGET } from './node';

export const getTokenBalances = async (param, serviceUrl) => {
	const searchParams = new URLSearchParams(param);
	const route = await serviceGET(`/api/v3/token/balances?${searchParams.toString()}`, serviceUrl);
	return route;
};
