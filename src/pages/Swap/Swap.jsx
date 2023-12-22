import React from 'react';
import { liskTokenCompact } from '../../constants/tokens';
import SwapWidget from '../../components/Swap/SwapWidget';

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
