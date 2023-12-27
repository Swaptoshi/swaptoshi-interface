import React from 'react';

export default function RadioButton({ title, selected }) {
	return (
		<div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
			<div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
				<div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
					<div className="sc-sx9n2y-0 kivXvb css-1aekuku">{title}</div>
				</div>
			</div>
			<button
				role="option"
				aria-selected={selected}
				className={`sc-1poje5t-0 ${selected ? 'jANAGB' : 'bQBOQe'}`}
			>
				<span className={`sc-1poje5t-1 ${selected ? 'jsjUXs' : 'bQBOQe'}`} />
			</button>
		</div>
	);
}
