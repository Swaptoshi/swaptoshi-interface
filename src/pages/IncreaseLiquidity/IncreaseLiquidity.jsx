import React from 'react';
import * as cryptography from '@klayr/cryptography';
import ModalContainer from '../../components/Modal/ModalContainer';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { decodeNFTId } from '../../utils/address/poolAddress';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import { useNavigate, useParams } from 'react-router-dom';
import LiquidityAmountsInput from '../../components/Liquidity/LiquidityAmountsInput';
import TextButton from '../../components/Button/TextButton';
import SlippageAndDeadlineConfig from '../../components/Config/SlippageAndDeadlineConfig';
import * as env from '../../utils/config/env';
import BigNumber from 'bignumber.js';
import TokenAvatar from '../../components/Avatar/token';
import PriceRangeLabel from '../../components/Price/PriceRangeLabel';
import LiquidityAmountsCard from '../../components/Position/LiquidityAmountsCard';
import Loader from '../../components/Loader';
import PositionPriceRange from '../../components/Position/PositionPriceRange';
import { decodeTickPrice } from '../../utils/math/priceFormatter';
import { useDebouncedCallback } from 'use-debounce';
import { getDEXPosition, getDEXPositionValue } from '../../service/dex';
import { tryToast } from '../../utils/toast/tryToast';
import { useChain } from '../../context/ChainProvider';

const IncreaseLiquidity = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { selectedService } = useChain();
	const { balances, senderPublicKey, auth } = useWalletConnect();
	const { sendTransaction } = useTransactionModal();

	const [token0, setToken0] = React.useState('token0');
	const [token1, setToken1] = React.useState('token1');
	const inverted = React.useMemo(() => token0 !== 'token0', [token0]);

	const [isLoading, setIsLoading] = React.useState(true);
	const [position, setPosition] = React.useState();
	const [positionValue, setPositionValue] = React.useState();

	const [amountA, setAmountA] = React.useState('');
	const [amountB, setAmountB] = React.useState('');
	const [error, setError] = React.useState();

	const [slippage, setSlippage] = React.useState('');
	const [deadline, setDeadline] = React.useState('');

	const price = React.useMemo(
		() =>
			position
				? decodeTickPrice(
						position.poolTick,
						position[`${inverted ? token1 : token0}Decimal`],
						position[`${inverted ? token0 : token1}Decimal`],
						inverted,
					)
				: 0,
		[inverted, position, token0, token1],
	);

	const lowPrice = React.useMemo(
		() =>
			position
				? decodeTickPrice(
						inverted ? position.tickUpper : position.tickLower,
						position[`${inverted ? token1 : token0}Decimal`],
						position[`${inverted ? token0 : token1}Decimal`],
						inverted,
					)
				: 0,
		[inverted, position, token0, token1],
	);

	const highPrice = React.useMemo(
		() =>
			position
				? decodeTickPrice(
						inverted ? position.tickLower : position.tickUpper,
						position[`${token0}Decimal`],
						position[`${token1}Decimal`],
						inverted,
					)
				: 0,
		[inverted, position, token0, token1],
	);

	const tokenA = React.useMemo(
		() =>
			position
				? {
						tokenId: position[`${token0}`],
						symbol: position[`${token0}Symbol`],
						decimal: position[`${token0}Decimal`],
						logo: position[`${token0}Logo`],
					}
				: undefined,
		[position, token0],
	);

	const tokenB = React.useMemo(
		() =>
			position
				? {
						tokenId: position[`${token1}`],
						symbol: position[`${token1}Symbol`],
						decimal: position[`${token1}Decimal`],
						logo: position[`${token1}Logo`],
					}
				: undefined,
		[position, token1],
	);

	const token0Balance = React.useMemo(() => {
		if (position && token0 && balances && balances.length > 0) {
			const foundToken = balances.find(t => t.tokenId === position[token0]);
			const foundBalance = foundToken ? Number(foundToken.balance) / 10 ** foundToken.decimal : 0;
			return foundBalance;
		}
		return 0;
	}, [balances, position, token0]);

	const token1Balance = React.useMemo(() => {
		if (position && token1 && balances && balances.length > 0) {
			const foundToken = balances.find(t => t.tokenId === position[token1]);
			const foundBalance = foundToken ? Number(foundToken.balance) / 10 ** foundToken.decimal : 0;
			return foundBalance;
		}
		return 0;
	}, [balances, position, token1]);

	React.useEffect(() => {
		setError();

		if (token0Balance && position && amountA && Number(token0Balance) < Number(amountA)) {
			setError(`Insufficient ${position[`${token0}Symbol`].toUpperCase()} balance`);
			return;
		}

		if (token1Balance && position && amountB && Number(token1Balance) < Number(amountB)) {
			setError(`Insufficient ${position[`${token1}Symbol`].toUpperCase()} balance`);
			return;
		}
	}, [amountA, amountB, error, position, token0, token0Balance, token1, token1Balance]);

	const isEverythingReady = React.useMemo(() => {
		return (
			!error && amountA !== undefined && amountA !== '' && amountB !== undefined && amountB !== ''
		);
	}, [amountA, amountB, error]);

	const handleReset = React.useCallback(() => {
		setToken0('token0');
		setToken1('token1');
		setAmountA('');
		setAmountB('');
		setError();
		setSlippage('');
		setDeadline('');
	}, []);

	const handleSwitch = React.useCallback(() => {
		setToken0(t => (t === 'token0' ? 'token1' : 'token0'));
		setToken1(t => (t === 'token1' ? 'token0' : 'token1'));
		setAmountA('');
		setAmountB('');
	}, []);

	const fetchPosition = useDebouncedCallback(async () => {
		const run = async () => {
			const pos = await getDEXPosition(
				{ search: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (pos && pos.data && pos.data.length > 0) {
				setPosition(pos.data[0]);
			}

			const value = await getDEXPositionValue(
				{ tokenId: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (value && value.data) {
				setPositionValue(value.data.value);
			}

			setIsLoading(false);
		};

		tryToast('Fetch positions failed', run, () => setIsLoading(false));
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		fetchPosition();
	}, [fetchPosition]);

	const handleIncreaseLiquidity = React.useCallback(() => {
		const amount0Desired = Math.floor(
			Number(inverted ? amountB : amountA) * 10 ** position[`${token0}Decimal`],
		);
		const amount1Desired = Math.floor(
			Number(inverted ? amountA : amountB) * 10 ** position[`${token1}Decimal`],
		);

		const deadlineFactor = deadline ? deadline : Number(env.DEFAULT_DEADLINE_MINUTE);
		const slippageFactor = slippage ? slippage : Number(env.DEFAULT_SLIPPAGE);

		const { index } = decodeNFTId(position.tokenId);

		const transaction = {
			module: 'dex',
			command: 'increaseLiquidity',
			fee: '1000000',
			params: {
				poolAddress: cryptography.address
					.getAddressFromKlayr32Address(position.poolAddress)
					.toString('hex'),
				tokenId: index.toString(),
				amount0Desired: amount0Desired.toString(),
				amount1Desired: amount1Desired.toString(),
				amount0Min: new BigNumber(amount0Desired)
					.minus(new BigNumber(amount0Desired).multipliedBy(slippageFactor).dividedBy(100))
					.toFixed(0)
					.toString(),
				amount1Min: new BigNumber(amount1Desired)
					.minus(new BigNumber(amount1Desired).multipliedBy(slippageFactor).dividedBy(100))
					.toFixed(0)
					.toString(),
				deadline: (Math.floor(Date.now() / 1000) + deadlineFactor * 60).toString(),
			},
			nonce: auth.nonce,
			senderPublicKey: senderPublicKey,
			signatures: new Array(auth.numberOfSignatures || 1).fill('0'.repeat(128)),
		};
		sendTransaction({
			transaction,
			onSuccess: () => {
				navigate(`/pools/${id}`);
			},
		});
	}, [
		amountA,
		amountB,
		auth,
		deadline,
		id,
		inverted,
		navigate,
		position,
		sendTransaction,
		senderPublicKey,
		slippage,
		token0,
		token1,
	]);

	return isLoading ? (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Loader size={20} />{' '}
		</div>
	) : !position || !positionValue ? (
		<div
			style={{
				width: '100%',
				height: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			Liquidity position not found
		</div>
	) : (
		<div>
			<ModalContainer
				title={'Add Liquidity'}
				backTo={`/pools/${id}`}
				topRightComponent={
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div className="hide-below-425">
							<TextButton onClick={handleReset}>Clear all</TextButton>
						</div>

						<div>
							<SlippageAndDeadlineConfig
								slippage={slippage}
								setSlippage={setSlippage}
								deadline={deadline}
								setDeadline={setDeadline}
							/>
						</div>
					</div>
				}
			>
				<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 PositionPage__ResponsiveRow-sc-f1e5edbd-7 dKubqp cPCYrp bIFEzi iYnZBs">
					<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 PositionPage__PositionLabelRow-sc-f1e5edbd-14 dKubqp cPCYrp kjbeBO">
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<TokenAvatar src={position[`${token0}Logo`]} size={24} tokenId={position[token0]} />
							<TokenAvatar
								src={position[`${token1}Logo`]}
								size={24}
								tokenId={position[token1]}
								style={{ marginLeft: '-10px' }}
							/>
							<div style={{ margin: '0px 4px' }} />
							<div style={{ color: 'var(--text-1)', fontSize: '20px', fontWeight: 600 }}>
								{position[`${token0}Symbol`]} / {position[`${token1}Symbol`]}
							</div>
						</div>
						<div style={{ flex: 1 }} />
						<PriceRangeLabel
							liquidity={position.liquidity}
							currentTick={position.poolTick}
							tickLower={position.tickLower}
							tickUpper={position.tickUpper}
						/>
					</div>
				</div>

				<LiquidityAmountsCard
					withFee
					position={position}
					value={positionValue}
					token0={token0}
					token1={token1}
				/>

				<PositionPriceRange
					title={'Selected range'}
					position={position}
					token0={token0}
					token1={token1}
					onSwitch={handleSwitch}
				/>

				<div
					style={{
						color: 'var(--text-1)',
						fontWeight: 600,
						fontSize: '16px',
						margin: '8px 0px',
						opacity: !error ? 0.5 : 1,
					}}
				>
					Add more liquidity
				</div>

				<LiquidityAmountsInput
					poolAddress={position ? position.poolAddress : undefined}
					price={price}
					lowPrice={lowPrice}
					highPrice={highPrice}
					isLoading={isLoading}
					amountA={amountA}
					setAmountA={setAmountA}
					tokenA={tokenA}
					amountB={amountB}
					setAmountB={setAmountB}
					tokenB={tokenB}
				/>

				<WalletActionButton
					disabled={!isEverythingReady}
					onClick={handleIncreaseLiquidity}
					style={{ height: '60px' }}
				>
					{error ? error : isLoading ? 'Loading...' : 'Add Liquidity'}
				</WalletActionButton>
			</ModalContainer>
		</div>
	);
};

export default IncreaseLiquidity;
