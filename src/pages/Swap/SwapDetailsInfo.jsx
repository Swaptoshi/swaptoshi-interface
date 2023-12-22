import React from 'react';
import Tooltip from '../../components/Tooltip/Tooltip';
import Loader from '../../components/Loader/Loader';
import { DEFAULT_SLIPPAGE } from './Swap';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import { useDebouncedCallback } from 'use-debounce';
import { tryToast } from '../../utils/Toast/tryToast';
import { getPrice } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';

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
}) {
	const { prices, fiatFormatter, cryptoFormatter } = useLiskPrice();
	const { selectedService, chain } = useChain();
	const [collapsed, setCollapsed] = React.useState(false);
	const [feeFiat, setFeeFiat] = React.useState();
	const [isFetchingPrice, setIsFectingPrice] = React.useState(false);

	const fetchFeeFiat = useDebouncedCallback(async (networkFee, lskPrice) => {
		await tryToast(
			'Quote fee price failed',
			async () => {
				const tokenToLskPrice = await getPrice(
					{
						baseTokenId: networkFee.tokenID,
						quoteTokenId: `${chain}00000000000000`,
					},
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (tokenToLskPrice && tokenToLskPrice.data) {
					setFeeFiat(
						(Number(networkFee.minimum) / 10 ** process.env.REACT_APP_WC_TOKEN_DECIMAL) *
							tokenToLskPrice.data.price *
							lskPrice,
					);
				}
			},
			undefined,
			() => setIsFectingPrice(false),
		);
	}, 600);

	const slippageValue = React.useMemo(() => {
		return slippage ? slippage : DEFAULT_SLIPPAGE;
	}, [slippage]);

	const toogleCollapsed = React.useCallback(() => setCollapsed(s => !s), []);

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
				<div className="text" style={{ width: 'fit-content', flex: 1 }}>
					{isLoading
						? 'Fetching best price...'
						: baseValue && quoteValue
							? `1 ${quoteToken.symbol.toUpperCase()} = ${
									baseValue / quoteValue
								} ${baseToken.symbol.toUpperCase()}`
							: 'Quote price failed'}
				</div>
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
										color: 'var(--text-color)',
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
												? 'var(--color-white)'
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
										color: 'var(--text-color)',
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
											backgroundColor: 'var(--open-currency-btn-bg)',
											borderRadius: '16px',
											padding: '2px 8px',
											fontSize: '12px',
											marginRight: '8px',
											color: 'var(--text-clr)',
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
										color: 'var(--text-color)',
										alignItems: 'center',
									}}
								>
									Network fee
									<Tooltip
										content={`Network cost is paid in ${
											process.env.REACT_APP_WC_TOKEN_SYMBOL
										} on the ${
											process.env.REACT_APP_WC_PROJECT_NAME
										} network in order to transact. Minimum required fee is ${cryptoFormatter.format(
											Number(networkFee.minimum) / 10 ** process.env.REACT_APP_WC_TOKEN_DECIMAL,
										)} ${process.env.REACT_APP_WC_TOKEN_SYMBOL}`}
									>
										<i style={{ margin: '0 2px' }} className="ri-information-line"></i>
									</Tooltip>
								</div>
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
