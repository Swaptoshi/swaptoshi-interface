import React from 'react';
import SwapWidget from '../../components/Swap/SwapWidget';
import { useChain } from '../../context/ChainProvider';

const Swap = () => {
	const { lskTokenInfo } = useChain();

	return (
		<React.Fragment>
			<div className="swap-wrapper">
				<div className="card-section">
					<SwapWidget initialBaseToken={lskTokenInfo} />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Swap;
