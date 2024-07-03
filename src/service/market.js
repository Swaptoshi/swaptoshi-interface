import { serviceGET } from './node';

export const getKlayrMarket = async serviceUrl => {
	const market = await serviceGET('/api/v3/market/prices', serviceUrl);
	return market;
};
