import React from 'react';
import './Card.css';

export default function Card({ children, ...props }) {
	return (
		<div className="card-box" {...props}>
			{children}
		</div>
	);
}
