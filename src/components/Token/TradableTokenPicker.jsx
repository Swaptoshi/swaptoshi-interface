import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';

export default function TradalbeTokenPicker({ value, onClose, onSelect }) {
	const { pickTradableToken } = useTokenPicker();

	return value ? (
		<button
			id={`open-currency-select-${value.symbol}`}
			className={'open-currency-btn-top'}
			onClick={() => pickTradableToken({ selected: value, onClose, onSelect })}
		>
			<span className={value ? 'span-one' : 'span-two'}>
				<div className="cryptocurrency-wrapper">
					<div className="image-wrapper">
						<div>
							<img className="icon-image" src={value?.imgSrc} alt={value?.symbol} />
						</div>
					</div>
					<span className="token-name">{value?.symbol}</span>
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
			onClick={() => pickTradableToken({ selected: value, onClose, onSelect })}
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
