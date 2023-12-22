import React from 'react';
import { liskTokenCompact } from '../../constants/tokens';
import SwapWidget from '../../components/Swap/SwapWidget';
import { useTransactionModal } from '../../context/TransactionModalProvider';

const Swap = () => {
	const { sendTransaction } = useTransactionModal();

	return (
		<React.Fragment>
			<div className="swap-wrapper">
				<div className="card-section">
					<SwapWidget
						initialBaseToken={liskTokenCompact}
						onSwapClick={transaction =>
							sendTransaction({ transaction, onClose: () => console.log('close') })
						}
					/>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Swap;
