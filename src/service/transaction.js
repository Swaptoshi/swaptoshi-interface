import { servicePOST } from './node';

export const getTransactionEstimateFee = async (transaction, serviceUrl) => {
	const estimatedFee = await servicePOST(
		`/api/v3/transactions/estimate-fees`,
		{ transaction },
		serviceUrl,
	);
	return estimatedFee;
};

export const dryRunTransaction = async (transaction, serviceUrl) => {
	const estimatedFee = await servicePOST(
		`/api/v3/transactions/dryrun`,
		{ transaction },
		serviceUrl,
	);
	return estimatedFee;
};

export const postTransaction = async (transaction, serviceUrl) => {
	const postResult = await servicePOST(`/api/v3/transactions`, { transaction }, serviceUrl);
	return postResult;
};
