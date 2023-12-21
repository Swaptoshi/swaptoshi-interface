import React from 'react';

export default function SwitchBox({ value, items, ...props }) {
	return (
		<div className="sc-bczRLJ sc-nrd8cx-0 foniQS jGtsjx" {...props}>
			<div className="sc-bczRLJ sc-nrd8cx-0 sc-1euncec-1 hJYFVB xyz1 etXiLa">
				{items.map((item, index) => {
					return (
						<div
							key={index}
							onClick={value === item.value ? undefined : item.onClick}
							style={{ cursor: value === item.value ? 'unset' : 'pointer' }}
							className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
								value === item.value ? 'eqaHKd' : ''
							}`}
						>
							<div className="sc-sx9n2y-0 kandXm css-rjqmed text">{item.component}</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
