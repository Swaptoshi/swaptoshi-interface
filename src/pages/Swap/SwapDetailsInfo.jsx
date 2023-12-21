import React from 'react';
import Tooltip from '../../components/Tooltip/Tooltip';
import Loader from '../../components/Loader/Loader';

export default function SwapDetailsInfo({
	isLoading,
	priceImpact,
	priceReady,
	isSlippageAuto,
	slippage,
	baseToken,
	baseValue,
	quoteToken,
	quoteValue,
}) {
	const [collapsed, setCollapsed] = React.useState(false);

	const toogleCollapsed = React.useCallback(() => setCollapsed(s => !s), []);

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
									style={{ width: 'fit-content', flex: 1, color: 'var(--text-color)' }}
								>
									Price impact
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
									style={{ width: 'fit-content', flex: 1, color: 'var(--text-color)' }}
								>
									Max. slippage
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
									}}
								>
									Price impact
									<Tooltip content={'This is a new tooltip that we just created'}>
										<i style={{ margin: '0 2px' }} className="ri-information-line"></i>
									</Tooltip>
								</div>
								<div className="text">1.12%</div>
							</div>
						</div>
					)}
				</div>
			) : null}
		</div>
	) : null;
}
