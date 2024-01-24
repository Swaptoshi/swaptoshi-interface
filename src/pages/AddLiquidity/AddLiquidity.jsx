import './AddLiquidity.css';
import React from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import ModalContainer from '../../components/Modal/ModalContainer';
import TradableTokenPicker from '../../components/Token/TradableTokenPicker';
import { useChain } from '../../context/ChainProvider';
import WalletActionButton from '../../components/Button/WalletActionButton';
import PriceInput from '../../components/Price/PriceInput';
import WarningBox from '../../components/Error/WarningBox';
import PoolFeeSelector from '../../components/Fee/PoolFeeSelector';
import { tryToast } from '../../utils/toast/tryToast';
import { computePoolAddress, getPoolKey } from '../../utils/address/poolAddress';
import { getDEXPool, getDEXPoolTick } from '../../service/dex';
import Decimal from 'decimal.js';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import { decodeTickPrice, encodePriceSqrt, encodeTickPrice } from '../../utils/math/priceFormatter';
import { getTickAtSqrtRatio } from '../../utils/tick/tick_math';
import { useNavigate } from 'react-router-dom';
import { getMaxTick, getMinTick } from '../../utils/tick/price_tick';
import { useDebouncedCallback } from 'use-debounce';
import LiquidityChartRangeInput from '../../components/Liquidity/LiquidityChartRangeInput';
import { INFINITE, ZERO } from '../../utils/constants/tick';
import TokenSwitchBox from '../../components/SwitchBox/TokenSwitchBox';
import SwitchBox from '../../components/SwitchBox/SwitchBox';
import { normalizeTick } from '../../utils/tick/normalize_tick';
import LiquidityAmountsInput from '../../components/Liquidity/LiquidityAmountsInput';
import TextButton from '../../components/Button/TextButton';
import SlippageAndDeadlineConfig from '../../components/Config/SlippageAndDeadlineConfig';
import * as env from '../../utils/config/env';
import BigNumber from 'bignumber.js';

const AddLiquidity = () => {
	const navigate = useNavigate();
	const { lskTokenInfo, selectedService } = useChain();
	const { balances, senderPublicKey, auth } = useWalletConnect();
	const { sendTransaction } = useTransactionModal();

	const [isLoading, setIsLoading] = React.useState(false);
	const [noPoolError, setNoPoolError] = React.useState();
	const [priceRangeError, setPriceRangeError] = React.useState();
	const [notActiveWarning, setNotActiveWarning] = React.useState();

	const [tokenA, setTokenA] = React.useState();
	const [tokenB, setTokenB] = React.useState();
	const [fee, setFee] = React.useState();
	const [tickSpacing, setTickSpacing] = React.useState();
	const [lowPrice, setLowPrice] = React.useState();
	const [highPrice, setHighPrice] = React.useState();
	const [amountA, setAmountA] = React.useState('');
	const [amountB, setAmountB] = React.useState('');
	const [ticks, setTicks] = React.useState();
	const [feeAmountTickSpacing, setFeeAmountTickSpacing] = React.useState();
	const [pool, setPool] = React.useState();
	const [inverted, setInverted] = React.useState();
	const [price, setPrice] = React.useState();
	const [error, setError] = React.useState();

	const [slippage, setSlippage] = React.useState('');
	const [deadline, setDeadline] = React.useState('');

	const minTick = React.useMemo(
		() => (tickSpacing ? getMinTick(tickSpacing) : undefined),
		[tickSpacing],
	);
	const minPrice = React.useMemo(() => (minTick ? decodeTickPrice(minTick) : 0), [minTick]);

	const maxTick = React.useMemo(
		() => (tickSpacing ? getMaxTick(tickSpacing) : undefined),
		[tickSpacing],
	);
	const maxPrice = React.useMemo(() => (maxTick ? decodeTickPrice(maxTick) : 0), [maxTick]);

	const ticksAtLimit = React.useMemo(() => {
		let lowerLimit = false;
		let upperLimit = false;

		try {
			lowerLimit =
				(lowPrice
					? lowPrice === ZERO || new Decimal(lowPrice).lte(minPrice)
						? minTick
						: encodeTickPrice(Number(lowPrice) > 0 ? lowPrice : '0', tickSpacing).toString()
					: undefined) === minTick;
		} catch {
			/* empty */
		}

		try {
			upperLimit =
				(highPrice
					? highPrice === INFINITE || new Decimal(highPrice).gte(maxPrice)
						? maxTick
						: encodeTickPrice(Number(highPrice) > 0 ? highPrice : '0', tickSpacing).toString()
					: undefined) === maxTick;
		} catch {
			/* empty */
		}

		return {
			['LOWER']: lowerLimit,
			['UPPER']: upperLimit,
		};
	}, [lowPrice, minPrice, minTick, tickSpacing, highPrice, maxPrice, maxTick]);

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
		setError();

		if (tokenABalance && tokenA && amountA && Number(tokenABalance) < Number(amountA)) {
			setError(`Insufficient ${tokenA.symbol.toUpperCase()} balance`);
			return;
		}

		if (tokenBBalance && tokenB && amountB && Number(tokenBBalance) < Number(amountB)) {
			setError(`Insufficient ${tokenB.symbol.toUpperCase()} balance`);
			return;
		}
	}, [amountA, amountB, error, tokenA, tokenABalance, tokenB, tokenBBalance]);

	React.useEffect(() => {
		if (tokenA && tokenB) {
			setInverted(tokenA.tokenId >= tokenB.tokenId);
		}
	}, [tokenA, tokenB]);

	React.useEffect(() => {
		setTokenA(lskTokenInfo);
	}, [lskTokenInfo]);

	const fetchPoolTickData = useDebouncedCallback(async () => {
		const checkPool = async () => {
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
						const newData = [];
						let activeLiquidity = 0;

						for (
							let i = inverted ? poolTick.data.length - 1 : 0;
							inverted ? i >= 0 : i < poolTick.data.length;
							inverted ? i-- : i++
						) {
							const t = poolTick.data[i];
							activeLiquidity = Number(
								BigInt(activeLiquidity) + BigInt(t.liquidityNet) * BigInt(inverted ? -1 : 1),
							);

							const chartEntry = {
								activeLiquidity,
								price0: inverted ? parseFloat(t.price1) : parseFloat(t.price0),
							};

							newData.push(chartEntry);
						}

						setTicks(newData);
					}
				}
				setIsLoading(false);
			}
		};

		tryToast('Check pool failed', checkPool, () => setIsLoading(false));
	}, 500);

	React.useEffect(() => {
		if (
			tokenA !== undefined &&
			tokenB !== undefined &&
			fee !== undefined &&
			feeAmountTickSpacing !== undefined &&
			tickSpacing
		) {
			setIsLoading(true);
			setNoPoolError();
			setTicks();
			setPool();
			setPrice();

			fetchPoolTickData();
		}
	}, [
		fee,
		feeAmountTickSpacing,
		fetchPoolTickData,
		inverted,
		selectedService,
		tickSpacing,
		tokenA,
		tokenB,
	]);

	React.useEffect(() => {
		if (lowPrice && highPrice && price) {
			setPriceRangeError();
			setNotActiveWarning();

			if (Number(highPrice) <= Number(lowPrice)) {
				setPriceRangeError(
					'Invalid range selected. The min price must be lower than the max price.',
				);
				return;
			}
			if (
				(Number(lowPrice) < price && Number(highPrice) < price) ||
				(Number(lowPrice) > price && Number(highPrice) > price)
			) {
				setNotActiveWarning(
					'Your position will not earn fees or be used in trades until the market price moves into your range.',
				);
				return;
			}
		}
	}, [lowPrice, highPrice, price]);

	const isSpecifyPriceReady = React.useMemo(() => {
		return tokenA !== undefined && tokenB !== undefined && fee !== undefined && pool !== undefined;
	}, [fee, pool, tokenA, tokenB]);

	const isDepositReady = React.useMemo(() => {
		return lowPrice !== undefined && lowPrice !== '' && highPrice !== undefined && highPrice !== '';
	}, [highPrice, lowPrice]);

	const noError = React.useMemo(() => {
		return !error && !noPoolError && !priceRangeError;
	}, [error, priceRangeError, noPoolError]);

	const isEverythingReady = React.useMemo(() => {
		return (
			isSpecifyPriceReady &&
			isDepositReady &&
			noError &&
			amountA !== undefined &&
			amountA !== '' &&
			amountB !== undefined &&
			amountB !== ''
		);
	}, [amountA, amountB, isDepositReady, isSpecifyPriceReady, noError]);

	const handleReset = React.useCallback(() => {
		setIsLoading(false);
		setNoPoolError();
		setPriceRangeError();
		setNotActiveWarning();
		setTokenA();
		setTokenB();
		setFee();
		setTickSpacing();
		setLowPrice();
		setHighPrice();
		setAmountA('');
		setAmountB('');
		setTicks();
		setPool();
		setInverted();
		setPrice();
		setError();
		setSlippage('');
		setDeadline('');
	}, []);

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
	}, []);

	const handleHighPriceInput = React.useCallback(e => {
		setHighPrice(e);
	}, []);

	const handleSwitch = React.useCallback(() => {
		setTokenA(tokenB);
		setTokenB(tokenA);
		setAmountA('');
		setAmountB('');

		if (highPrice !== INFINITE) {
			setLowPrice((1 / Number(highPrice)).toFixed(5));
		}

		if (lowPrice !== ZERO) {
			setHighPrice((1 / Number(lowPrice)).toFixed(5));
		}
	}, [highPrice, lowPrice, tokenA, tokenB]);

	const handleAddLiquidity = React.useCallback(() => {
		const poolKey = getPoolKey(tokenA.tokenId, tokenB.tokenId, fee);
		const priceLower = lowPrice === ZERO ? minPrice : lowPrice;
		const priceUpper = highPrice === INFINITE ? maxPrice : highPrice;

		const lowerSqrtPirce = encodePriceSqrt(inverted ? 1 : priceLower, inverted ? priceLower : 1);
		const higherSqrtPirce = encodePriceSqrt(inverted ? 1 : priceUpper, inverted ? priceUpper : 1);
		const lowerTick = getTickAtSqrtRatio(lowerSqrtPirce);
		const higherTick = getTickAtSqrtRatio(higherSqrtPirce);

		const tickLower = normalizeTick(inverted ? higherTick : lowerTick, tickSpacing);
		const tickUpper = normalizeTick(inverted ? lowerTick : higherTick, tickSpacing);

		const token0 = inverted ? tokenB : tokenA;
		const token1 = inverted ? tokenA : tokenB;

		const amount0Desired = Math.floor(Number(inverted ? amountB : amountA) * 10 ** token0.decimal);
		const amount1Desired = Math.floor(Number(inverted ? amountA : amountB) * 10 ** token1.decimal);

		const deadlineFactor = deadline ? deadline : Number(env.DEFAULT_DEADLINE_MINUTE);
		const slippageFactor = slippage ? slippage : Number(env.DEFAULT_SLIPPAGE);

		const transaction = {
			module: 'dex',
			command: 'mint',
			fee: '1000000',
			params: {
				token0: poolKey.token0,
				token1: poolKey.token1,
				fee,
				tickLower,
				tickUpper,
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
				recipient: cryptography.address
					.getAddressFromPublicKey(Buffer.from(senderPublicKey, 'hex'))
					.toString('hex'),
				deadline: (Math.floor(Date.now() / 1000) + deadlineFactor * 60).toString(),
			},
			nonce: auth.nonce,
			senderPublicKey: senderPublicKey,
			signatures: new Array(auth.numberOfSignatures || 1).fill('0'.repeat(128)),
		};
		sendTransaction({
			transaction,
			onSuccess: () => {
				navigate('/pools');
			},
		});
	}, [
		amountA,
		amountB,
		auth,
		deadline,
		fee,
		highPrice,
		inverted,
		lowPrice,
		maxPrice,
		minPrice,
		navigate,
		sendTransaction,
		senderPublicKey,
		slippage,
		tickSpacing,
		tokenA,
		tokenB,
	]);

	return (
		<div>
			<ModalContainer
				title={'Add Liquidity'}
				backTo={'/pools'}
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
				<div style={{ display: 'flex' }}>
					<TradableTokenPicker
						value={tokenA}
						blocked={tokenB}
						onSelect={handleTokenAChange}
						style={{ borderRadius: '20px', overflow: 'hidden', width: '50%' }}
						theme={'secondary'}
					/>
					<div style={{ margin: '0px 4px' }} />
					<TradableTokenPicker
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

				{noPoolError ? (
					<WarningBox fill icon={'ri-alert-line'} type={'error'} textSize={10}>
						{noPoolError}
					</WarningBox>
				) : null}

				<div className="flex-above-375" style={{ alignItems: 'center' }}>
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
					<div style={{ flex: 1 }} />
					{tokenA && tokenB && (
						<div style={{ display: 'flex' }}>
							<SwitchBox
								className={'halfscreen-below-375'}
								containerClassName={'full-range-button'}
								style={{ marginRight: '8px' }}
								unselectedBackgroundColor={'var(--switch-button)'}
								unselectedTextColor={'var(--text-clr)'}
								selectedTextColor={'var(--color-white)'}
								selectedBackgroundColor={'var(--surface-1)'}
								value={lowPrice === ZERO && highPrice === INFINITE}
								items={[
									{
										value: true,
										onClick: () => {
											setAmountA('');
											setAmountB('');
											setLowPrice(ZERO);
											setHighPrice(INFINITE);
										},
										component: <div style={{ fontSize: '12px' }}>Full Range</div>,
									},
								]}
							/>
							<TokenSwitchBox
								className="add-liqudity-switch-token"
								containerClassName={'halfscreen-below-375'}
								tokenA={tokenA}
								tokenB={tokenB}
								onSwitch={handleSwitch}
							/>
						</div>
					)}
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

				{priceRangeError || notActiveWarning ? (
					<WarningBox fill icon={'ri-alert-line'} type={'warning'} textSize={10}>
						{priceRangeError ?? notActiveWarning}
					</WarningBox>
				) : null}

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
							<LiquidityChartRangeInput
								currencyA={tokenA ?? undefined}
								currencyB={tokenB ?? undefined}
								feeAmount={fee}
								tickSpacing={tickSpacing}
								ticks={ticks}
								ticksAtLimit={ticksAtLimit}
								price={price}
								priceLower={lowPrice}
								priceUpper={highPrice}
								onLeftRangeInput={handleLowPriceInput}
								onRightRangeInput={handleHighPriceInput}
								interactive={ticks && ticks.length > 0}
								isLoading={isLoading}
								error={error}
							/>
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

				<LiquidityAmountsInput
					poolAddress={pool ? pool.poolAddress : undefined}
					price={price}
					lowPrice={lowPrice}
					highPrice={highPrice}
					isLoading={!isSpecifyPriceReady || !isDepositReady}
					amountA={amountA}
					setAmountA={setAmountA}
					tokenA={tokenA}
					amountB={amountB}
					setAmountB={setAmountB}
					tokenB={tokenB}
				/>

				<WalletActionButton
					disabled={!isEverythingReady}
					onClick={handleAddLiquidity}
					style={{ height: '60px' }}
				>
					{error ? error : isLoading ? 'Loading...' : 'Add Liquidity'}
				</WalletActionButton>
			</ModalContainer>
		</div>
	);
};

export default AddLiquidity;
