import React from 'react';

export default function TokenPickerBase({ value, onClose, onSelect, picker }) {
	return value ? (
		<button
			id={`open-currency-select-${value.symbol}`}
			className={'open-currency-btn-top'}
			onClick={() => picker({ selected: value, onClose, onSelect })}
		>
			<span className={'span-one'}>
				<div className="cryptocurrency-wrapper">
					<div className="image-wrapper">
						<div>
							<img className="icon-image" src={value.logo} alt={value.symbol} />
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
			className="open-currency-btn-bottom"
			onClick={() => picker({ selected: value, onClose, onSelect })}
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
