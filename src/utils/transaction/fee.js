import * as cryptography from '@liskhq/lisk-cryptography';
import { getDEXPool, getQuote } from '../../service/dex';
import { computePoolAddress, getPoolKey } from '../address/poolAddress';

const baseFeeMap = {
	[`dex:mint`]: 5100000,
};

export const getBaseFee = (module, command) => {
	if (baseFeeMap[`${module}:${command}`] !== undefined) return baseFeeMap[`${module}:${command}`];
	return 0;
};

export const isFeeConversion = async (
	balances,
	senderPublicKey,
	baseValue,
	baseToken,
	networkFee,
	dexConfig,
	feeConfig,
	selectedService,
) => {
	const tokenIn = baseToken.tokenId;
	const tokenOut = feeConfig.feeTokenID;

	if (
		feeConfig &&
		baseToken.tokenId !== feeConfig.feeTokenID &&
		dexConfig &&
		dexConfig.feeConversionEnabled &&
		networkFee &&
		balances &&
		senderPublicKey
	) {
		let senderFeeBalance = 0n;
		const foundFeeBalance = balances.find(t => t.tokenId === feeConfig.feeTokenID);
		if (foundFeeBalance) senderFeeBalance = BigInt(foundFeeBalance.balance);

		const feeDifference = senderFeeBalance - BigInt(networkFee);

		if (feeDifference < BigInt(0)) {
			const service = selectedService ? selectedService.serviceURLs : undefined;

			for (const feeTickSpaingMap of dexConfig.feeAmountTickSpacing) {
				const [fee] = feeTickSpaingMap;
				const poolAddress = cryptography.address.getLisk32AddressFromAddress(
					computePoolAddress(getPoolKey(tokenIn, tokenOut, fee)),
				);
				const pool = await getDEXPool({ search: poolAddress }, service);
				if (pool && pool.data && pool.data.length > 0) {
					const amountOut = (feeDifference * BigInt(-1)).toString();
					const quote = await getQuote({ base: tokenIn, quote: tokenOut, amountOut }, service);

					if (quote && quote.data) {
						let isEligible = true;

						const eligibilityBalance = balances.find(t => t.tokenId === tokenIn);
						if (
							!eligibilityBalance ||
							(eligibilityBalance &&
								BigInt(eligibilityBalance.balance) <
									BigInt(quote.data.amount) +
										BigInt(Math.floor(Number(baseValue) * Number(10 ** baseToken.decimal))))
						) {
							isEligible = false;
						}

						return {
							status: true,
							payload: {
								tokenIn: baseToken.symbol,
								amountIn: quote.data.amount,
								isEligible,
								poolExist: true,
							},
						};
					}
				}
			}

			return {
				status: true,
				payload: {
					tokenIn: baseToken.symbol,
					amountIn: '0',
					isEligible: false,
					poolExist: false,
				},
			};
		}
	}
	return {
		status: false,
		payload: {
			tokenIn: baseToken.symbol,
			amountIn: '0',
			isEligible: false,
			poolExist: false,
		},
	};
};
