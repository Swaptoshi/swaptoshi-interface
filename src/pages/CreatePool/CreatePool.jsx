import React from 'react';
import * as cryptography from '@klayr/cryptography';
import ModalContainer from '../../components/Modal/ModalContainer';
import WalletTokenPicker from '../../components/Token/WalletTokenPicker';
import PoolFeeSelector from '../../components/Fee/PoolFeeSelector';
import PriceInput from '../../components/Price/PriceInput';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { useNavigate } from 'react-router-dom';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { encodePriceSqrt } from '../../utils/math/priceFormatter';
import { useChain } from '../../context/ChainProvider';
import { getDEXPool } from '../../service/dex';
import { computePoolAddress, getPoolKey } from '../../utils/address/poolAddress';
import { tryToast } from '../../utils/toast/tryToast';
import WarningBox from '../../components/Error/WarningBox';

export default function CreatePool() {
	const navigate = useNavigate();
	const { lskTokenInfo, selectedService } = useChain();
	const { auth, senderPublicKey } = useWalletConnect();
	const { sendTransaction } = useTransactionModal();

	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState();
	const [tokenA, setTokenA] = React.useState();
	const [tokenB, setTokenB] = React.useState();
	const [fee, setFee] = React.useState();
	const [tickSpacing, setTickSpacing] = React.useState();
	const [price, setPrice] = React.useState();

	React.useEffect(() => {
		setTokenA(lskTokenInfo);
	}, [lskTokenInfo]);

	React.useEffect(() => {
		const checkPool = async () => {
			if (tokenA !== undefined && tokenB !== undefined && fee !== undefined) {
				setIsLoading(true);
				setError();
				const poolKey = getPoolKey(tokenA.tokenId, tokenB.tokenId, fee);
				const poolAddress = cryptography.address.getKlayr32AddressFromAddress(
					computePoolAddress(poolKey),
				);
				const pools = await getDEXPool(
					{ search: poolAddress, limit: 1 },
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (pools && pools.data) {
					if (pools.data.length > 0) {
						setError('Pool Already Exists');
					}
					setIsLoading(false);
				}
			}
		};

		tryToast('Check pool failed', checkPool, () => setIsLoading(false));
	}, [fee, selectedService, tokenA, tokenB]);

	const isSpecifyPriceReady = React.useMemo(() => {
		return tokenA !== undefined && tokenB !== undefined && fee !== undefined;
	}, [fee, tokenA, tokenB]);

	const isEverythingReady = React.useMemo(() => {
		return isSpecifyPriceReady && price !== undefined && price !== '' && price !== '0';
	}, [isSpecifyPriceReady, price]);

	const handleSelectFee = React.useCallback(selected => {
		setFee(Number(selected[0]));
		setTickSpacing(Number(selected[1]));
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

			{error ? (
				<WarningBox fill icon={'ri-alert-line'} type={'error'} textSize={10}>
					{error}
				</WarningBox>
			) : null}

			<div
				style={{
					color: 'var(--text-1)',
					fontWeight: 600,
					fontSize: '16px',
					margin: '8px 0px',
				}}
			>
				Specify Price
			</div>

			<PriceInput
				disabled={!isSpecifyPriceReady || error}
				tickSpacing={tickSpacing}
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
				disabled={!isEverythingReady || error}
				onClick={handleCreatePool}
				style={{ height: '60px' }}
			>
				{isLoading ? 'Loading...' : 'Create Pool'}
			</WalletActionButton>
		</ModalContainer>
	);
}
