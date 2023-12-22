import { serviceGET } from './node';

export const getFeeEstimates = async serviceUrl => {
	const fees = await serviceGET(`/api/v3/fees`, serviceUrl);
	return fees;
};
