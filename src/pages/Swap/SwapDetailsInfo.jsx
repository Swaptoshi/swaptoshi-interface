import React from 'react';
import Tooltip from '../../components/Tooltip/Tooltip';
import Loader from '../../components/Loader/Loader';

export default function SwapDetailsInfo({
	isLoading,
	baseToken,
	baseValue,
	quoteToken,
	quoteValue,
}) {
	const [collapsed, setCollapsed] = React.useState(false);

	const toogleCollapsed = React.useCallback(() => setCollapsed(s => !s), []);

	const priceReady = React.useMemo(
		() =>
			baseToken !== undefined &&
			quoteToken !== undefined &&
			(baseValue !== '' || quoteValue !== ''),
		[baseToken, baseValue, quoteToken, quoteValue],
	);

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
						: `1 ${quoteToken.symbol.toUpperCase()} = ${
								baseValue / quoteValue
							} ${baseToken.symbol.toUpperCase()}`}
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
								<div className="text">1.12%</div>
							</div>

							<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
								<div
									className="text"
									style={{ width: 'fit-content', flex: 1, color: 'var(--text-color)' }}
								>
									Price impact
								</div>
								<div className="text">1.12%</div>
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
