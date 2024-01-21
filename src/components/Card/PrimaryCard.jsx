import React from 'react';
import './Card.css';

export default function PrimaryCard({ children, ...props }) {
	return (
		<div className="card-box card-primary" {...props}>
			{children}
		</div>
	);
}
