import React from 'react';
import './Button.css';
import Loader from '../Loader';

export default function PrimaryButton(props) {
	let className = 'button-container primary-button-container ';
	if (props.className) className += props.className;

	return (
		<button {...props} className={className}>
			{props.loading === true || props.loading === 'true' ? (
				<div>
					<Loader size={20} />{' '}
				</div>
			) : (
				<div className="button-content">{props.children}</div>
			)}
		</button>
	);
}
