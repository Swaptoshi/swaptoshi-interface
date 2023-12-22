import { serviceGET } from './node';

export const getAccountAuth = async (params, serviceUrl) => {
	const searchParams = new URLSearchParams(params);
	const auth = await serviceGET(`/api/v3/auth?${searchParams.toString()}`, serviceUrl);
	return auth;
};
