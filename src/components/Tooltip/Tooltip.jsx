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
				border={'0.5px solid rgb(152 161 192 / 24%)'}
				style={{
					backgroundColor: 'var(--card-inside-color)',
					color: 'var(--color-white)',
					borderRadius: '8px',
					maxWidth: '250px',
					boxShadow:
						'rgb(0 0 0 / 7%) 8px 14px 20px, rgb(0 0 0 / 7%) 8px 4px 8px, rgb(0 0 0 / 7%) 1px 1px 4px',
				}}
			/>
		</div>
	);
}
