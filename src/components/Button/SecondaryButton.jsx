import React from 'react';
import './Button.css';
import Loader from '../Loader';

export default function SecondaryButton(props) {
	let className = 'secondary-button-container ';
	if (props.className) className += props.className;

	return (
		<button {...props} className={className}>
			{props.loading ? (
				<div>
					<Loader size={20} />{' '}
				</div>
			) : (
				<div className="secondary-button-content">{props.children}</div>
			)}
		</button>
	);
}
