import React from 'react';

export default function PriceRangeLabel({ liquidity, currentTick, tickLower, tickUpper }) {
	return (
		<div
			style={{
				fontSize: '14px',
				color:
					Number(liquidity) === 0
						? 'var(--text-clr)'
						: Number(currentTick) < Number(tickLower) || Number(currentTick) > Number(tickUpper)
							? 'var(--yellow)'
							: 'var(--green)',
				fontWeight: 600,
				display: 'flex',
				justifyContent: 'center',
			}}
		>
			{Number(liquidity) === 0
				? 'closed'
				: Number(currentTick) < Number(tickLower) || Number(currentTick) > Number(tickUpper)
					? 'out of range'
					: 'in range'}
			<i
				className={
					Number(liquidity) === 0
						? 'ri-close-circle-fill'
						: Number(currentTick) < Number(tickLower) || Number(currentTick) > Number(tickUpper)
							? 'ri-alert-fill'
							: 'ri-circle-fill'
				}
				style={{ marginLeft: '4px' }}
			/>
		</div>
	);
}
