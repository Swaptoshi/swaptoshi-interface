import React from 'react';

export default function WarningBox({ children, right, type, fill, textSize, icon }) {
	const color = React.useMemo(
		() => (type === 'error' ? 'red' : type === 'warning' ? 'yellow' : 'color-white'),
		[type],
	);

	return (
		<div
			style={{
				border: fill ? undefined : `1px solid var(--${color})`,
				borderRadius: '16px',
				padding: '12px 16px',
				fontSize: '14px',
				backgroundColor: fill ? `color-mix(in srgb, var(--${color}) 10%, transparent)` : undefined,
			}}
		>
			<div style={{ display: 'flex', alignItems: 'center', fontSize: textSize }}>
				{icon ? (
					<i className={icon} style={{ marginRight: '8px', color: `var(--${color})` }}></i>
				) : null}
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
