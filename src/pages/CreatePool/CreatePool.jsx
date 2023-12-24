import React from 'react';
import ModalContainer from '../../components/Modal/ModalContainer';
import WalletTokenPicker from '../../components/Token/WalletTokenPicker';
import PoolFeeSelector from '../../components/Fee/PoolFeeSelector';
import PriceInput from '../../components/Price/PriceInput';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { useNavigate } from 'react-router-dom';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { encodePriceSqrt } from '../../utils/Math/priceFormatter';
import { useChain } from '../../context/ChainProvider';

export default function CreatePool() {
	const navigate = useNavigate();
	const { lskTokenInfo } = useChain();
	const { auth, senderPublicKey } = useWalletConnect();
	const { sendTransaction } = useTransactionModal();

	const [tokenA, setTokenA] = React.useState();
	const [tokenB, setTokenB] = React.useState();
	const [fee, setFee] = React.useState();
	const [price, setPrice] = React.useState();

	React.useEffect(() => {
		setTokenA(lskTokenInfo);
	}, [lskTokenInfo]);

	const isSpecifyPriceReady = React.useMemo(() => {
		return tokenA !== undefined && tokenB !== undefined;
	}, [tokenA, tokenB]);

	const isEverythingReady = React.useMemo(() => {
		return (
			isSpecifyPriceReady &&
			fee !== undefined &&
			price !== undefined &&
			price !== '' &&
			price !== '0'
		);
	}, [fee, isSpecifyPriceReady, price]);

	const handleSelectFee = React.useCallback(selected => {
		setFee(selected);
	}, []);

	const handleTokenAChange = React.useCallback(selected => {
		setTokenA(selected);
	}, []);

	const handleTokenBChange = React.useCallback(selected => {
		setTokenB(selected);
	}, []);

	const handleCreatePool = React.useCallback(() => {
		const transaction = {
			module: 'dex',
			command: 'createPool',
			fee: '1000000',
			params: {
				tokenA: tokenA.tokenId,
				tokenASymbol: tokenA.symbol,
				tokenADecimal: tokenA.decimal,
				tokenB: tokenB.tokenId,
				tokenBSymbol: tokenB.symbol,
				tokenBDecimal: tokenB.decimal,
				fee: fee.toString(),
				sqrtPriceX96: encodePriceSqrt(1, price),
			},
			nonce: auth.nonce,
			senderPublicKey: senderPublicKey,
			signatures: new Array(auth.numberOfSignatures || 1).fill('0'.repeat(128)),
		};

		sendTransaction({
			transaction,
			onSuccess: () => navigate('/pools'),
		});
	}, [auth, fee, navigate, price, sendTransaction, senderPublicKey, tokenA, tokenB]);

	return (
		<ModalContainer title={'Create Pool'} backTo={'/pools'}>
			<div style={{ display: 'flex' }}>
				<WalletTokenPicker
					value={tokenA}
					blocked={tokenB}
					onSelect={handleTokenAChange}
					style={{ borderRadius: '20px', overflow: 'hidden', width: '50%' }}
					theme={'secondary'}
				/>
				<div style={{ margin: '0px 4px' }} />
				<WalletTokenPicker
					value={tokenB}
					blocked={tokenA}
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

			<PriceInput
				disabled={!isSpecifyPriceReady}
				title={
					isSpecifyPriceReady
						? `1 ${tokenB.symbol.toUpperCase()} equal to`
						: 'Please select token and fee'
				}
				subTitle={isSpecifyPriceReady ? `${tokenA.symbol.toUpperCase()}` : '-'}
				value={price}
				setValue={setPrice}
			/>

			<WalletActionButton
				disabled={!isEverythingReady}
				onClick={handleCreatePool}
				style={{ height: '60px' }}
			>
				Create Pool
			</WalletActionButton>
		</ModalContainer>
	);
}
