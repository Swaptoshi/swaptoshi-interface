import React from 'react';

function CustomDropdown({
	selectedOption,
	toggleDropdown,
	isOpen,
	optionsLabel,
	handleOptionClick,
}) {
	const ref = React.useRef(null);
	const isClickInside = React.useRef(false);

	React.useEffect(() => {
		if (!isOpen) return;

		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target) && isClickInside.current) {
				toggleDropdown();
			}
			isClickInside.current = false;
		}

		document.addEventListener('mouseup', handleClickOutside);
		return () => {
			document.removeEventListener('mouseup', handleClickOutside);
		};
	}, [isOpen, ref, toggleDropdown]);

	return (
		<div
			className="custom-dropdown"
			ref={ref}
			onClick={() => {
				toggleDropdown();
				isClickInside.current = true;
			}}
		>
			<div className="selected-option hover-shadow">
				<img src={selectedOption.imgSrc} alt={selectedOption.value} />
				<div style={{ width: '8px' }} />
				<span className="hide-1024">{selectedOption.label}</span>
				<span className="dropdown">
					<i className="nav-dropdown ri-arrow-down-s-line"></i>
				</span>
			</div>
			{isOpen && (
				<ul className="options">
					{optionsLabel.map((option, index) => (
						<li key={index} onClick={() => handleOptionClick(option)}>
							<div className="options-name">
								<img src={option.imgSrc} alt={option.label} />
								<span>{option.label}</span>
							</div>
							<div>
								{selectedOption.value === option.value && (
									<i className="tick-icon ri-check-line"></i>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default CustomDropdown;
