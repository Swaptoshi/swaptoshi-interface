import React from 'react';
import Tooltip from '../../components/Tooltip/Tooltip';
import Loader from '../../components/Loader/Loader';
import { useKlayrPrice } from '../../context/KlayrPriceProvider';
import { useDebouncedCallback } from 'use-debounce';
import { tryToast } from '../../utils/toast/tryToast';
import { getPrice } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import * as env from '../../utils/config/env';
import { useWalletConnect } from '../../context/WalletConnectProvider';

export default function SwapDetailsInfo({
	isLoading,
	command,
	priceImpact,
	priceReady,
	isSlippageAuto,
	slippage,
	baseToken,
	baseValue,
	quoteToken,
	quoteValue,
	networkFee,
	feeConversion,
}) {
	const { prices, fiatFormatter, cryptoFormatter } = useKlayrPrice();
	const { selectedService, chain, feeConfig, dexConfig } = useChain();
	const { senderPublicKey, balances } = useWalletConnect();
	const [collapsed, setCollapsed] = React.useState(false);
	const [feeFiat, setFeeFiat] = React.useState();
	const [isFetchingPrice, setIsFectingPrice] = React.useState(false);

	const [isFeeConvert, setIsFeeConvert] = React.useState();
	const [isEligibleFeeConversion, setIsEligibleFeeConversion] = React.useState();
	const [convertedBaseToken, setConvertedBaseToken] = React.useState();
	const [isPoolExistForConversion, setIsPoolExistForConversion] = React.useState();

	const fetchFeeFiat = useDebouncedCallback(
		async (networkFee, lskPrice) => {
			await tryToast(
				'Quote fee price failed',
				async () => {
					const tokenToLskPrice = await getPrice(
						{
							baseTokenId: feeConfig.feeTokenID,
							quoteTokenId: `${chain}00000000000000`,
						},
						selectedService ? selectedService.serviceURLs : undefined,
					);
					if (tokenToLskPrice && tokenToLskPrice.data) {
						setFeeFiat(
							(Number(networkFee) / 10 ** env.WC_TOKEN_DECIMAL) *
								tokenToLskPrice.data.price *
								lskPrice,
						);
					}
					setIsFectingPrice(false);
				},
				() => setIsFectingPrice(false),
			);
		},
		Number(env.EFFECT_DEBOUNCE_WAIT) + 100,
	);

	const slippageValue = React.useMemo(() => {
		return slippage ? slippage : Number(env.DEFAULT_SLIPPAGE);
	}, [slippage]);

	const toogleCollapsed = React.useCallback(() => setCollapsed(s => !s), []);

	React.useEffect(() => {
		if (!priceReady) {
			setIsFeeConvert();
			setIsEligibleFeeConversion();
			setConvertedBaseToken();
			return;
		}

		if (feeConversion) {
			setIsFeeConvert(feeConversion.status);
			if (feeConversion.status) {
				setIsEligibleFeeConversion(feeConversion.payload.isEligible);
				setConvertedBaseToken(Number(feeConversion.payload.amountIn) / 10 ** baseToken.decimal);
				setIsPoolExistForConversion(feeConversion.payload.poolExist);
			}
		}
	}, [
		balances,
		baseToken,
		baseValue,
		dexConfig,
		feeConfig,
		feeConversion,
		networkFee,
		priceReady,
		selectedService,
		senderPublicKey,
	]);

	React.useEffect(() => {
		if (networkFee && prices) {
			setIsFectingPrice(true);
			fetchFeeFiat(networkFee, prices);
		}
	}, [fetchFeeFiat, networkFee, prices]);

	return priceReady ? (
		<div
			style={{
				border: '1px solid var(--border)',
				borderRadius: '16px',
				padding: '12px 16px',
				fontSize: '14px',
			}}
		>
			<div
				style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
				onClick={toogleCollapsed}
			>
				<div
					className="text font12-below-320"
					style={{ width: 'fit-content', flex: 1, fontSize: '14px' }}
				>
					{isLoading
						? 'Fetching best price...'
						: baseValue && quoteValue
							? `1 ${quoteToken.symbol.toUpperCase()} = ${
									baseValue / quoteValue
								} ${baseToken.symbol.toUpperCase()}`
							: 'Quote price failed'}
				</div>
				{isFeeConvert && (
					<Tooltip
						content={
							isEligibleFeeConversion
								? !isPoolExistForConversion
									? `Automatic fee conversion could be enabled, but since required ${env.WC_TOKEN_SYMBOL}/${baseToken.symbol} pool is not created yet, or no liquidity, fee conversion can't be enabled.`
									: `Automatic fee conversion is enabled. Since you don't have enough ${env.WC_TOKEN_SYMBOL} balance for network fee, ${convertedBaseToken} ${baseToken.symbol} will be automatically converted by Swaptoshi Protocol for you.`
								: `Insufficient funds for fee conversion. Since you don't have enough ${env.WC_TOKEN_SYMBOL} balance and you don't have ${convertedBaseToken} ${baseToken.symbol} to be converted for network fee, automatic fee conversion can't be enabled.`
						}
					>
						<div
							style={{
								backgroundColor: isEligibleFeeConversion
									? 'var(--green)'
									: isPoolExistForConversion
										? 'var(--red)'
										: 'var(--yellow)',
								borderRadius: '24px',
								height: '24px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								padding: '0 8px',
							}}
						>
							<i className="ri-token-swap-line" style={{ color: 'var(--surface-1)' }}></i>
						</div>
					</Tooltip>
				)}
				<div className="text" style={{ fontSize: '18px' }}>
					{collapsed ? (
						<i className="ri-arrow-up-s-line"></i>
					) : (
						<i className="ri-arrow-down-s-line"></i>
					)}
				</div>
			</div>

			{collapsed ? (
				<div>
					<div style={{ height: '1px', backgroundColor: 'var(--border)', marginTop: '12px' }} />

					{isLoading ? (
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								width: '100%',
								height: '100px',
							}}
						>
							<Loader size={20} />
						</div>
					) : (
						<div>
							<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
								<div
									className="text"
									style={{
										width: 'fit-content',
										flex: 1,
										color: 'var(--text-3)',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									Price impact
									<Tooltip content={'The impact your trade has on the market price of this pool.'}>
										<i style={{ margin: '0 2px' }} className="ri-information-line"></i>
									</Tooltip>
								</div>
								<div
									className="text"
									style={{
										color:
											priceImpact < 0.03
												? 'var(--text-1)'
												: priceImpact < 0.05
													? 'var(--yellow)'
													: 'var(--red)',
									}}
								>
									~{(priceImpact * 100).toFixed(4)}%
								</div>
							</div>

							<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
								<div
									className="text"
									style={{
										width: 'fit-content',
										flex: 1,
										color: 'var(--text-3)',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									Max. slippage
									<Tooltip
										content={`If the price moves so that you will ${
											command === 'exactInput' ? 'receive less' : 'pay more'
										} than ${
											command === 'exactInput'
												? (quoteValue - (quoteValue * slippageValue) / 100).toFixed(
														quoteToken.decimal,
													)
												: (baseValue + (baseValue * slippageValue) / 100).toFixed(baseToken.decimal)
										} ${
											command === 'exactInput'
												? quoteToken.symbol.toUpperCase()
												: baseToken.symbol.toUpperCase()
										}, your transaction will be reverted. This is the minimum amount you are guaranteed to ${
											command === 'exactInput' ? 'receive' : 'pay'
										}.`}
									>
										<i style={{ margin: '0 2px' }} className="ri-information-line"></i>
									</Tooltip>
								</div>
								{isSlippageAuto ? (
									<div
										style={{
											backgroundColor: 'var(--surface-3)',
											borderRadius: '16px',
											padding: '2px 8px',
											fontSize: '12px',
											marginRight: '8px',
											color: 'var(--text-3)',
										}}
									>
										Auto
									</div>
								) : null}
								<div className="text">{isSlippageAuto ? '0.5%' : `${slippage}%`}</div>
							</div>

							<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0 0 0' }}>
								<div
									className="text"
									style={{
										width: 'fit-content',
										flex: 1,
										display: 'flex',
										color: 'var(--text-3)',
										alignItems: 'center',
									}}
								>
									Network fee
									<Tooltip
										content={`Network cost is paid in ${env.WC_TOKEN_SYMBOL} on the ${
											env.WC_PROJECT_NAME
										} network in order to transact. Minimum required fee is ${cryptoFormatter.format(
											Number(networkFee) / 10 ** env.WC_TOKEN_DECIMAL,
										)} ${env.WC_TOKEN_SYMBOL}`}
									>
										<i style={{ margin: '0 2px' }} className="ri-information-line"></i>
									</Tooltip>
								</div>
								{isFeeConvert && isPoolExistForConversion && (
									<div
										style={{
											backgroundColor: 'var(--surface-3)',
											borderRadius: '16px',
											padding: '2px 8px',
											fontSize: '12px',
											marginRight: '8px',
											color: 'var(--text-3)',
										}}
									>
										Conv
									</div>
								)}
								{isFetchingPrice ? (
									<div>
										<Loader size={10} />{' '}
									</div>
								) : (
									<div className="text">{fiatFormatter.format(feeFiat.toFixed(8))}</div>
								)}
							</div>
						</div>
					)}
				</div>
			) : null}
		</div>
	) : null;
}
