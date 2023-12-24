import React from 'react';
import TokenAvatar from '../Avatar/token';

export default function TokenPickerBase({
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
			id={`open-currency-select-${value.symbol}`}
			className={'open-currency-btn-top'}
			onClick={handlePick}
			style={style}
		>
			<span className={'span-one'}>
				<div className="cryptocurrency-wrapper">
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
				<div className="dropdown-icon">
					<i className="ri-arrow-down-s-line"></i>
				</div>
			</span>
		</button>
	) : (
		<button
			id={`open-currency-select-unselected`}
			className={`open-currency-btn-bottom picker-${theme}`}
			onClick={handlePick}
			style={style}
		>
			<span className="span-two">
				<div className="cryptocurrency-wrapper">
					<div className="text-wrapper">
						<span className="select-token">Select token</span>
					</div>
				</div>
				<div className="dropdown-icon">
					<i className="ri-arrow-down-s-line"></i>
				</div>
			</span>
		</button>
	);
}
