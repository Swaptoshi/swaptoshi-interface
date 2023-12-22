import { servicePOST } from './node';

export const getTransactionEstimateFee = async (transaction, serviceUrl) => {
	const estimatedFee = await servicePOST(
		`/api/v3/transactions/estimate-fees`,
		{ transaction },
		serviceUrl,
	);
	return estimatedFee;
};
