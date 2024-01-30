import { serviceGET } from './node';

export const getBlockchainApps = async (params, serviceUrl) => {
	const searchParams = new URLSearchParams(params);
	const apps = await serviceGET(
		`/api/v3/blockchain/apps/meta?${searchParams.toString()}`,
		serviceUrl,
	);
	return apps;
};
