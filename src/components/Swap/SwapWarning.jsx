import React from 'react';
import WarningBox from '../Error/WarningBox';

export default function SwapWarning({ priceImpact }) {
	return priceImpact > 0.15 ? (
		<WarningBox type={'error'} right={`~${(priceImpact * 100).toFixed(4)}%`}>
			Price impact warning
		</WarningBox>
	) : null;
}
