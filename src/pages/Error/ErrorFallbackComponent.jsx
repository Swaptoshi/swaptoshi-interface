import React from 'react';
import PrimaryButton from '../../components/Button/PrimaryButton';
import SecondaryButton from '../../components/Button/SecondaryButton';

export default function ErrorFallbackComponent({ error, resetErrorBoundary }) {
	const [showError, setShowError] = React.useState(false);

	return (
		<div
			style={{
				backgroundColor: 'var(--body-bg)',
				width: '100vw',
				minHeight: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<div style={{ maxWidth: '100vw', width: '800px', padding: '16px' }}>
				<p style={{ fontSize: '80px', color: 'var(--color-white)' }}>{':('}</p>
				<p style={{ color: 'var(--color-white)', fontSize: '20px', fontWeight: 600 }}>
					Oops! Looks like something went wrong.
				</p>
				<p style={{ color: 'var(--color-white)', fontSize: '14px' }}>
					If you&apos;re still having trouble, we&apos;d appreciate your help in fixing this hiccup!
					Please report the issue on our GitHub Repository so we can get it sorted out. Thanks for
					your patience!
				</p>
				{showError && (
					<div
						style={{
							maxWidth: '100vw',
							backgroundColor: 'var(--dropdown-bg)',
							border: '1px solid var(--border)',
							borderRadius: '16px',
							marginBottom: '8px',
						}}
					>
						<pre style={{ color: 'var(--red)', fontSize: '14px', padding: '12px', margin: '0' }}>
							{error.stack}
						</pre>
					</div>
				)}
				<button
					onClick={() => setShowError(s => !s)}
					style={{
						backgroundColor: 'transparent',
						display: 'flex',
						border: 0,
						fontSize: '14px',
						color: 'var(--btn-color)',
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: '16px',
					}}
				>
					{showError ? 'Hide error' : 'Show error'}
					{showError ? (
						<i className="ri-arrow-up-s-line" style={{ fontSize: '16px' }}></i>
					) : (
						<i className="ri-arrow-down-s-line" style={{ fontSize: '16px' }}></i>
					)}
				</button>
				<div style={{ display: 'flex' }}>
					<SecondaryButton
						style={{ width: '125px' }}
						onClick={() =>
							window.open('https://github.com/Swaptoshi/swaptoshi-interface/issues/new', '_blank')
						}
					>
						Report
					</SecondaryButton>
					<div style={{ width: '8px' }} />
					<PrimaryButton style={{ width: '125px' }} onClick={resetErrorBoundary}>
						Reload
					</PrimaryButton>
				</div>
			</div>
		</div>
	);
}
