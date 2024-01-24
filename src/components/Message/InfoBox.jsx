import React from 'react';

export default function InfoBox({ message, icon }) {
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				color: 'var(--text-1)',
				opacity: 0.5,
			}}
		>
			<i className={icon} style={{ fontSize: '45px' }} />
			<div>{message}</div>
		</div>
	);
}
