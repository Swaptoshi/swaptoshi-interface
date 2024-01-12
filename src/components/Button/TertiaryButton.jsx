import React from 'react';
import './Button.css';
import Loader from '../Loader';

export default function TertiaryButton(props) {
	let className = 'tertiary-button-container ';
	if (props.className) className += props.className;

	return (
		<button {...props} className={className}>
			{props.loading === true || props.loading === 'true' ? (
				<div>
					<Loader size={20} />{' '}
				</div>
			) : (
				<div className="tertiary-button-content">{props.children}</div>
			)}
		</button>
	);
}
