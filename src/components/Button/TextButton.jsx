import React from 'react';

export default function TextButton({ onClick, children }) {
	return (
		<button
			onClick={onClick}
			className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonText-sc-4f96dcd8-9 hWKjgZ jtnClT"
		>
			<div className="text__TextWrapper-sc-9327e48a-0 cWDToC css-15li2d9">{children}</div>
		</button>
	);
}
