import React from 'react';
import { Tooltip as ReactTooltip } from 'react-tooltip';

export default function Tooltip({ content, children }) {
	const id = React.useMemo(() => Math.random(), []);

	return (
		<div>
			<a data-tooltip-id={id} data-tooltip-content={content}>
				{children}
			</a>
			<ReactTooltip
				id={id}
				border={'var(--card-border-color)'}
				opacity={1}
				style={{
					backgroundColor: 'var(--surface-2)',
					zIndex: 99999,
					color: 'var(--color-white)',
					borderRadius: '8px',
					maxWidth: '250px',
					boxShadow: 'var(--box-shadow)',
				}}
			/>
		</div>
	);
}
