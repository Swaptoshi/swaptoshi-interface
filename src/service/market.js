import { serviceGET } from './node';

export const getLiskMarket = async serviceUrl => {
	const market = await serviceGET('/api/v3/market/prices', serviceUrl);
	return market;
};
