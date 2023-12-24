import React from 'react';

export default function WarningBox({ children, right, type }) {
	const color = React.useMemo(
		() => (type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'color-white'),
		[type],
	);

	return (
		<div
			style={{
				border: `1px solid var(--${color})`,
				borderRadius: '16px',
				padding: '12px 16px',
				fontSize: '14px',
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<div className="text" style={{ width: 'fit-content', flex: 1, color: `var(--${color})` }}>
					{children}
				</div>
				<div className="text" style={{ color: `var(--${color})` }}>
					{right}
				</div>
			</div>
		</div>
	);
}
