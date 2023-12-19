import React from 'react';
import Dialog from '../Tooltip/Dialog';

function Dropdown({ selectedOption, optionsLabel, handleOptionClick }) {
	const [show, setShow] = React.useState(false);

	const onClickOutside = React.useCallback(() => {
		setShow(false);
	}, []);

	const onOptionClick = React.useCallback(
		option => {
			handleOptionClick(option);
			setShow(false);
		},
		[handleOptionClick],
	);

	const onAnchorClick = React.useCallback(() => {
		setShow(s => !s);
	}, []);

	return (
		<Dialog
			show={show}
			onClickOutside={onClickOutside}
			className="options chain-selector"
			anchor={
				<div className="selected-option hover-shadow" onClick={onAnchorClick}>
					<img src={selectedOption.imgSrc} alt={selectedOption.value} />
					<div style={{ width: '8px' }} />
					<span className="hide-1024">{selectedOption.label}</span>
					<span className="dropdown">
						<i className="nav-dropdown ri-arrow-down-s-line"></i>
					</span>
				</div>
			}
		>
			<ul>
				{optionsLabel.map((option, index) => (
					<li key={index} onClick={() => onOptionClick(option)}>
						<div className="options-name">
							<img src={option.imgSrc} alt={option.label} />
							<span>{option.label}</span>
						</div>
						<div>
							{selectedOption.value === option.value && <i className="tick-icon ri-check-line"></i>}
						</div>
					</li>
				))}
			</ul>
		</Dialog>
	);
}

export default Dropdown;
