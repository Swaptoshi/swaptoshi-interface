import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NotFound() {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				width: '100%',
				height: '100vh',
			}}
		>
			{/* <div style={{ textAlign: 'center' }}>
				<div style={{ fontSize: '32px', fontWeight: 600, color: 'var(--color-white)' }}>404</div>
				<div style={{ fontSize: '16px', color: 'var(--color-white)' }}>Not Found</div>
			</div> */}
			<div
				style={{
					textAlign: 'center',
					maxWidth: '100vw',
					width: '600px',
					padding: '16px',
					color: 'var(--color-white)',
				}}
			>
				<i className="ri-compass-3-line" style={{ fontSize: '80px' }}></i>
				<div style={{ fontSize: '28px', fontWeight: 600, marginBottom: '16px' }}>
					Oops! Page Not Found
				</div>
				<p>
					Looks like we&apos;ve lost our way in space. Please double-check the URL or return to{' '}
					<NavLink to="/">homepage</NavLink>.
				</p>
			</div>
		</div>
	);
}