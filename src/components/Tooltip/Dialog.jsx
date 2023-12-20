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
						boxShadow:
							'rgb(0 0 0 / 7%) 8px 14px 20px, rgb(0 0 0 / 7%) 8px 4px 8px, rgb(0 0 0 / 7%) 1px 1px 4px',
						border: '0.5px solid rgb(152 161 192 / 24%)',
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
