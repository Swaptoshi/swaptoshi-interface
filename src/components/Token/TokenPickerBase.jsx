import React from 'react';
import TokenAvatar from '../Avatar/token';

export default function TokenPickerBase({
	disableSelect,
	value,
	blocked,
	onClose,
	onSelect,
	picker,
	style,
	theme,
}) {
	const handlePick = React.useCallback(() => {
		picker({ selected: value, blocked, onClose, onSelect });
	}, [blocked, onClose, onSelect, picker, value]);

	return value ? (
		<button
			disabled={disableSelect}
			id={`open-currency-select-${value.symbol}`}
			className={'open-currency-btn-top'}
			onClick={handlePick}
			style={style}
		>
			<span className={'span-one'}>
				<div className="cryptocurrency-wrapper">
					<div style={{ margin: '0px 2px' }} />
					<div className="image-wrapper">
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<TokenAvatar src={value.logo} size={25} tokenId={value.tokenId} />
						</div>
					</div>
					<span className="token-name">{value.symbol}</span>
				</div>
				{!disableSelect ? (
					<div className="dropdown-icon">
						<i className="ri-arrow-down-s-line"></i>
					</div>
				) : null}
			</span>
		</button>
	) : (
		<button
			disabled={disableSelect}
			id={`open-currency-select-unselected`}
			className={`open-currency-btn-bottom picker-${theme}`}
			onClick={handlePick}
			style={{
				...style,
				backgroundColor: theme === 'secondary' ? 'var(--open-currency-btn-bg)' : 'var(--btn-color)',
				color: theme === 'secondary' ? 'var(--color-white)' : 'var(--white)',
			}}
		>
			<span className="span-two">
				<div
					className="cryptocurrency-wrapper"
					style={{ maxWidth: disableSelect ? '100%' : '85%' }}
				>
					<div className="text-wrapper">
						<span className="select-token">Select token</span>
					</div>
				</div>
				{!disableSelect ? (
					<div className="dropdown-icon">
						<i className="ri-arrow-down-s-line"></i>
					</div>
				) : null}
			</span>
		</button>
	);
}
