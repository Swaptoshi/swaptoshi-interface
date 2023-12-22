import React from 'react';
import SwapWidget from './SwapWidget';
import { liskTokenCompact } from '../../constants/tokens';

const Swap = () => {
	return (
		<React.Fragment>
			<div className="swap-wrapper">
				<div className="card-section">
					<SwapWidget initialBaseToken={liskTokenCompact} />
				</div>
			</div>
		</React.Fragment>
	);
};

export default Swap;
