import React from 'react';
import './Button.css';

export default function SecondaryButton(props) {
	let className = 'secondary-button-container ';
	if (props.className) className += props.className;

	return (
		<button {...props} className={className}>
			<div className="secondary-button-content">{props.children}</div>
		</button>
	);
}
