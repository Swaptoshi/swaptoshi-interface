import React from 'react';
import ModalContainer from '../../components/Modal/ModalContainer';
import WalletTokenPicker from '../../components/Token/WalletTokenPicker';

export default function CreatePool() {
	const [tokenA, setTokenA] = React.useState();
	const [tokenB, setTokenB] = React.useState();

	const handleTokenAChange = React.useCallback(selected => {
		setTokenA(selected);
	}, []);

	const handleTokenBChange = React.useCallback(selected => {
		setTokenB(selected);
	}, []);

	return (
		<ModalContainer title={'Create Pool'} backTo={'/pools'}>
			<div style={{ display: 'flex' }}>
				<WalletTokenPicker
					value={tokenA}
					onSelect={handleTokenAChange}
					style={{ borderRadius: '20px', overflow: 'hidden', width: '50%' }}
					theme={'secondary'}
				/>
				<div style={{ margin: '0px 4px' }} />
				<WalletTokenPicker
					value={tokenB}
					onSelect={handleTokenBChange}
					style={{ borderRadius: '20px', overflow: 'hidden', width: '50%' }}
					theme={'secondary'}
				/>
			</div>
		</ModalContainer>
	);
}
