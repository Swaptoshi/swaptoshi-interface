import React from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import LiquidityChart from './LiquidityChart';
import ModalContainer from '../../components/Modal/ModalContainer';
import WalletTokenPicker from '../../components/Token/WalletTokenPicker';
import { useChain } from '../../context/ChainProvider';
import WalletActionButton from '../../components/Button/WalletActionButton';
import PriceInput from '../../components/Price/PriceInput';
import WarningBox from '../../components/Error/WarningBox';
import PoolFeeSelector from '../../components/Fee/PoolFeeSelector';
import { tryToast } from '../../utils/Toast/tryToast';
import { computePoolAddress, getPoolKey } from '../../utils/Address/poolAddress';
import { getDEXPool, getDEXPoolTick } from '../../service/dex';
import SwapTokenInput from '../../components/Swap/SwapTokenInput';
import { calculateAmount0, calculateAmount1 } from '../../utils/Liquidity/liquidityAmount';
import Decimal from 'decimal.js';
import { useWalletConnect } from '../../context/WalletConnectProvider';

const LiquidityModal = () => {
	const { lskTokenInfo, selectedService } = useChain();
	const { balances } = useWalletConnect();

	const [isLoading, setIsLoading] = React.useState(false);
	const [noPoolError, setNoPoolError] = React.useState();
	const [tokenA, setTokenA] = React.useState();
	const [tokenB, setTokenB] = React.useState();
	const [fee, setFee] = React.useState();
	const [tickSpacing, setTickSpacing] = React.useState();
	const [lowPrice, setLowPrice] = React.useState();
	const [highPrice, setHighPrice] = React.useState();
	const [amountA, setAmountA] = React.useState();
	const [amountB, setAmountB] = React.useState();
	const [ticks, setTicks] = React.useState();
	const [feeAmountTickSpacing, setFeeAmountTickSpacing] = React.useState();
	const [pool, setPool] = React.useState();
	const [inverted, setInverted] = React.useState();
	const [price, setPrice] = React.useState();
	const [error, setError] = React.useState();

	const tokenABalance = React.useMemo(() => {
		if (tokenA && balances && balances.length > 0) {
			const foundToken = balances.find(t => t.tokenId === tokenA.tokenId);
			const foundBalance = foundToken ? Number(foundToken.balance) / 10 ** foundToken.decimal : 0;
			return foundBalance;
		}
		return 0;
	}, [balances, tokenA]);

	const tokenBBalance = React.useMemo(() => {
		if (tokenB && balances && balances.length > 0) {
			const foundToken = balances.find(t => t.tokenId === tokenB.tokenId);
			const foundBalance = foundToken ? Number(foundToken.balance) / 10 ** foundToken.decimal : 0;
			return foundBalance;
		}
		return 0;
	}, [balances, tokenB]);

	React.useEffect(() => {
		if (tokenABalance && tokenA && amountA && Number(tokenABalance) < Number(amountA)) {
			setError(`Insufficient ${tokenA.symbol.toUpperCase()} balance`);
			return;
		}
	}, [amountA, error, tokenA, tokenABalance]);

	React.useEffect(() => {
		if (tokenBBalance && tokenB && amountB && Number(tokenBBalance) < Number(amountB)) {
			setError(`Insufficient ${tokenB.symbol.toUpperCase()} balance`);
			return;
		}
	}, [amountB, error, tokenB, tokenBBalance]);

	const handleAmountAInputChange = React.useCallback(
		event => {
			const inputValue = event.target.value;
			setError();

			if (inputValue === '' || inputValue === '0') {
				setAmountA('');
				setAmountB('');
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setAmountA(inputValue);
				if (lowPrice && highPrice && pool) {
					if (Number(lowPrice) > Number(price) && Number(highPrice) > Number(price)) {
						setAmountB('0');
					} else {
						const amountB = calculateAmount1(inputValue, price, highPrice, lowPrice);
						setAmountB(amountB);
					}
				}
			}
		},
		[highPrice, lowPrice, pool, price],
	);

	const handleAmountAMax = React.useCallback(max => {
		setError();
		setAmountA(max);
	}, []);

	const handleAmountBInputChange = React.useCallback(
		event => {
			setError();
			const inputValue = event.target.value;

			if (inputValue === '' || inputValue === '0') {
				setAmountB('');
				setAmountA('');
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setAmountB(inputValue);
				if (lowPrice && highPrice && pool) {
					if (Number(lowPrice) < Number(price) && Number(highPrice) < Number(price)) {
						setAmountA('0');
					} else {
						const amountA = calculateAmount0(inputValue, price, highPrice, lowPrice);
						setAmountA(amountA);
					}
				}
			}
		},
		[highPrice, lowPrice, pool, price],
	);

	const handleAmountBMax = React.useCallback(max => {
		setError();
		setAmountB(max);
	}, []);

	React.useEffect(() => {
		if (tokenA && tokenB) {
			setInverted(tokenA.tokenId >= tokenB.tokenId);
		}
	}, [tokenA, tokenB]);

	React.useEffect(() => {
		setTokenA(lskTokenInfo);
	}, [lskTokenInfo]);

	React.useEffect(() => {
		const checkPool = async () => {
			if (
				tokenA !== undefined &&
				tokenB !== undefined &&
				fee !== undefined &&
				feeAmountTickSpacing !== undefined
			) {
				setIsLoading(true);
				setNoPoolError();

				const poolKey = getPoolKey(tokenA.tokenId, tokenB.tokenId, fee);
				const poolAddress = cryptography.address.getLisk32AddressFromAddress(
					computePoolAddress(poolKey),
				);
				const pools = await getDEXPool(
					{ search: poolAddress, limit: 1 },
					selectedService ? selectedService.serviceURLs : undefined,
				);

				if (pools && pools.data) {
					if (pools.data.length === 0) {
						setNoPoolError("Pool Doesn't Exists");
					} else {
						setPool(pools.data[0]);
						setPrice(
							inverted
								? new Decimal(pools.data[0].price).pow(-1).toPrecision(5)
								: pools.data[0].price,
						);

						const poolTick = await getDEXPoolTick(
							{ poolAddress },
							selectedService ? selectedService.serviceURLs : undefined,
						);
						if (poolTick && poolTick.data && poolTick.data.length > 0) {
							const data = [];
							let liquidity = 0;
							for (
								let i = poolTick.data[0].tick;
								i < poolTick.data[poolTick.data.length - 1].tick;
								i += 1
							) {
								const matched = poolTick.data.find(t => t.tick === i);
								if (matched) {
									liquidity += matched.liquidityNet;
								}
								data.push([i, liquidity]);
							}
							setTicks(data);
						}
					}
					setIsLoading(false);
				}
			}
		};

		tryToast('Check pool failed', checkPool, () => setIsLoading(false));
	}, [fee, feeAmountTickSpacing, inverted, selectedService, tokenA, tokenB]);

	const isSpecifyPriceReady = React.useMemo(() => {
		return tokenA !== undefined && tokenB !== undefined && fee !== undefined && pool !== undefined;
	}, [fee, pool, tokenA, tokenB]);

	const isDepositReady = React.useMemo(() => {
		return lowPrice !== undefined && lowPrice !== '' && highPrice !== undefined && highPrice !== '';
	}, [highPrice, lowPrice]);

	const isEverythingReady = React.useMemo(() => {
		return (
			isSpecifyPriceReady &&
			isDepositReady &&
			amountA !== undefined &&
			amountA !== '' &&
			amountB !== undefined &&
			amountB !== ''
		);
	}, [amountA, amountB, isDepositReady, isSpecifyPriceReady]);

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

	const handleLowPriceInput = React.useCallback(e => {
		setLowPrice(e);
		setAmountA('');
		setAmountB('');
	}, []);

	const handleHighPriceInput = React.useCallback(e => {
		setHighPrice(e);
		setAmountA('');
		setAmountB('');
	}, []);

	const handleAddLiquidity = React.useCallback(() => {}, []);

	return (
		<div>
			<ModalContainer title={'Add Liquidity'} backTo={'/pools'}>
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

				<PoolFeeSelector
					selected={fee}
					onSelect={handleSelectFee}
					onLoad={setFeeAmountTickSpacing}
				/>

				{noPoolError ? <WarningBox type={'error'}>{noPoolError}</WarningBox> : null}

				<div
					style={{
						color: 'var(--color-white)',
						fontWeight: 600,
						fontSize: '16px',
						margin: '8px 0px',
						opacity: !isSpecifyPriceReady || !!noPoolError ? 0.5 : 1,
					}}
				>
					Set Price Range
				</div>

				<PriceInput
					disabled={!isSpecifyPriceReady || !!noPoolError}
					tickSpacing={tickSpacing}
					title={'Low price'}
					subTitle={
						isSpecifyPriceReady
							? `${tokenB.symbol.toUpperCase()} per ${tokenA.symbol.toUpperCase()}`
							: '-'
					}
					value={lowPrice}
					setValue={handleLowPriceInput}
				/>

				<PriceInput
					disabled={!isSpecifyPriceReady || !!noPoolError}
					tickSpacing={tickSpacing}
					title={'High price'}
					subTitle={
						isSpecifyPriceReady
							? `${tokenB.symbol.toUpperCase()} per ${tokenA.symbol.toUpperCase()}`
							: '-'
					}
					value={highPrice}
					setValue={handleHighPriceInput}
				/>

				<div className="Column__AutoColumn-sc-72c388fb-2 erfjwt" style={{ minHeight: 200 }}>
					{pool ? (
						<div style={{ opacity: !isSpecifyPriceReady || !!noPoolError ? 0.5 : 1 }}>
							<div style={{ marginLeft: '16px', color: 'var(--color-white)' }}>
								<div style={{ fontSize: '12px' }}>Current price:</div>
								<div style={{ fontWeight: 600 }}>{price}</div>
								<div style={{ fontSize: '12px' }}>
									{inverted ? pool.token0Symbol : pool.token1Symbol} per{' '}
									{inverted ? pool.token1Symbol : pool.token0Symbol}
								</div>
							</div>
							{ticks && ticks.length > 0 ? (
								<LiquidityChart
									data={ticks}
									currentTick={pool.tick}
									token0={tokenA}
									token1={tokenB}
									lowPrice={lowPrice}
									highPrice={highPrice}
								/>
							) : (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
										color: 'var(--color-white)',
										opacity: 0.5,
									}}
								>
									<i className="ri-bar-chart-grouped-line" style={{ fontSize: '45px' }} />
									<div>No liquidity data.</div>
								</div>
							)}
						</div>
					) : (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'var(--color-white)',
								opacity: 0.5,
							}}
						>
							<i className="ri-inbox-2-line" style={{ fontSize: '45px' }} />
							<div>Your active liquidity positions will appear here.</div>
						</div>
					)}
				</div>

				<div
					style={{
						color: 'var(--color-white)',
						fontWeight: 600,
						fontSize: '16px',
						margin: '8px 0px',
						opacity: !isSpecifyPriceReady || !isDepositReady ? 0.5 : 1,
					}}
				>
					Deposit Amounts
				</div>

				{Number(lowPrice) < Number(price) && Number(highPrice) < Number(price) ? null : (
					<SwapTokenInput
						isLoading={!isSpecifyPriceReady || !isDepositReady}
						disableSelect={true}
						inputValue={amountA}
						onInputChange={handleAmountAInputChange}
						selectedToken={tokenA}
						onMaxClick={handleAmountAMax}
					/>
				)}

				{Number(lowPrice) > Number(price) && Number(highPrice) > Number(price) ? null : (
					<SwapTokenInput
						isLoading={!isSpecifyPriceReady || !isDepositReady}
						disableSelect={true}
						inputValue={amountB}
						onInputChange={handleAmountBInputChange}
						selectedToken={tokenB}
						onMaxClick={handleAmountBMax}
					/>
				)}

				<WalletActionButton
					disabled={!isEverythingReady || !!noPoolError || !!error}
					onClick={handleAddLiquidity}
					style={{ height: '60px' }}
				>
					{error ? error : isLoading ? 'Loading...' : 'Add Liquidity'}
				</WalletActionButton>
			</ModalContainer>
		</div>
	);
};

export default LiquidityModal;
