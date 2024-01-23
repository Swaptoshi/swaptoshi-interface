import React from 'react';
import Dialog from '../Tooltip/Dialog';

function Dropdown({
	hideLabelMobile,
	selectedOption,
	optionsLabel,
	handleOptionClick,
	className,
	anchorClassName,
}) {
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
			className={'options '.concat(className)}
			style={{ padding: 0 }}
			anchor={
				<div
					className={'selected-option hover-shadow '.concat(anchorClassName)}
					onClick={onAnchorClick}
				>
					{selectedOption.imgSrc ? (
						<div style={{ marginRight: '8px' }}>
							<img src={selectedOption.imgSrc} alt={selectedOption.value} />
							<div style={{ width: '8px' }} />
						</div>
					) : null}
					<span className={hideLabelMobile ? 'hide-below-320' : ''}>{selectedOption.label}</span>
					<span className="dropdown">
						<i className="nav-dropdown ri-arrow-down-s-line"></i>
					</span>
				</div>
			}
		>
			<ul>
				{optionsLabel.map((option, index) => (
					<li
						key={index}
						onClick={() => onOptionClick(option)}
						style={{ paddingLeft: '16px', paddingRight: '16px' }}
					>
						<div className="options-name">
							{option.imgSrc ? <img src={option.imgSrc} alt={option.label} /> : null}
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
