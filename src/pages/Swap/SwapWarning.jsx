import React from 'react';

export default function SwapWarning() {
	return (
		<div
			style={{
				border: '1px solid var(--red)',
				borderRadius: '16px',
				padding: '12px 16px',
				fontSize: '14px',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<div className="text" style={{ width: 'fit-content', flex: 1, color: 'var(--red)' }}>
					Price impact warning
				</div>
				<div className="text" style={{ color: 'var(--red)' }}>
					12.213%
				</div>
			</div>
		</div>
	);
}
