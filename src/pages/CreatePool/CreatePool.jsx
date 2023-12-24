import React from 'react';
import ModalContainer from '../../components/Modal/ModalContainer';
import WalletTokenPicker from '../../components/Token/WalletTokenPicker';
import PoolFeeSelector from '../../components/Fee/PoolFeeSelector';
import PriceInput from '../../components/Price/PriceInput';
import WalletActionButton from '../../components/Button/WalletActionButton';

export default function CreatePool() {
	const [tokenA, setTokenA] = React.useState();
	const [tokenB, setTokenB] = React.useState();
	const [fee, setFee] = React.useState();
	const [price, setPrice] = React.useState();

	const isReady = true;

	const handleSelectFee = React.useCallback(selected => {
		setFee(selected);
	}, []);

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

			<PoolFeeSelector selected={fee} onSelect={handleSelectFee} />

			<div
				style={{
					color: 'var(--color-white)',
					fontWeight: 600,
					fontSize: '16px',
					margin: '8px 0px',
				}}
			>
				Specify Price
			</div>

			<PriceInput title={'1 ETH equal to'} subTitle={'UNI'} value={price} setValue={setPrice} />

			<WalletActionButton disabled={!isReady} style={{ height: '60px' }}>
				Create Pool
			</WalletActionButton>
		</ModalContainer>
	);
}
