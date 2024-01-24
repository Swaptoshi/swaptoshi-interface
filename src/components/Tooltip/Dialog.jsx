import React from 'react';

function Dialog({ show, onClickOutside, className, anchor, children, style }) {
	const ref = React.useRef(null);
	const isClickInside = React.useRef(false);

	React.useEffect(() => {
		if (onClickOutside === undefined || !show) return;

		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target) && isClickInside.current) {
				onClickOutside();
			}
			isClickInside.current = false;
		}

		document.addEventListener('mouseup', handleClickOutside);
		return () => {
			document.removeEventListener('mouseup', handleClickOutside);
		};
	}, [onClickOutside, ref, show]);

	return (
		<div
			className="custom-dropdown"
			ref={ref}
			onClick={() => {
				isClickInside.current = true;
			}}
		>
			{anchor}
			{show && (
				<div
					className={className}
					style={{
						position: 'absolute',
						backgroundColor: 'var(--nav-drop)',
						boxShadow: 'var(--box-shadow)',
						border: 'var(--card-border-color)',
						borderRadius: '12px',
						padding: '8px',
						zIndex: 100,
						...style,
					}}
				>
					{children}
				</div>
			)}
		</div>
	);
}

export default Dialog;
