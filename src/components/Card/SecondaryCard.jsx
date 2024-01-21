import React from 'react';
import './Card.css';

export default function SecondaryCard({ children, ...props }) {
	return (
		<div className="card-box card-secondary" {...props}>
			{children}
		</div>
	);
}
