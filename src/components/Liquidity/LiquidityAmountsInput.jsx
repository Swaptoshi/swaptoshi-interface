import React from 'react';
import SwapTokenInput from '../Swap/SwapTokenInput';
import { decodePoolAddress } from '../../utils/address/poolAddress';
import { useChain } from '../../context/ChainProvider';
import { calculateAmount0, calculateAmount1 } from '../../utils/liquidity/liquidityAmount';
import { getMaxTick, getMinTick } from '../../utils/tick/price_tick';
import { decodeTickPrice } from '../../utils/math/priceFormatter';
import { INFINITE, ZERO } from '../../utils/constants/tick';

export default function LiquidityAmountsInput({
	pool,
	lowPrice,
	price,
	highPrice,
	isLoading,
	amountA,
	setAmountA,
	tokenA,
	amountB,
	setAmountB,
	tokenB,
}) {
	const { dexConfig } = useChain();

	const tickSpacing = React.useMemo(() => {
		if (dexConfig && pool) {
			const { fee } = decodePoolAddress(pool.poolAddress);
			const tickSpacing = dexConfig.feeAmountTickSpacing.find(t => t[0] === fee.toString());
			if (tickSpacing) {
				return tickSpacing[1];
			}
		}
		return undefined;
	}, [dexConfig, pool]);

	const minTick = React.useMemo(
		() => (tickSpacing ? getMinTick(tickSpacing) : undefined),
		[tickSpacing],
	);
	const minPrice = React.useMemo(() => (minTick ? decodeTickPrice(minTick) : 0), [minTick]);
	const lowerPrice = React.useMemo(
		() => (lowPrice === ZERO ? minPrice : lowPrice),
		[lowPrice, minPrice],
	);

	const maxTick = React.useMemo(
		() => (tickSpacing ? getMaxTick(tickSpacing) : undefined),
		[tickSpacing],
	);
	const maxPrice = React.useMemo(() => (maxTick ? decodeTickPrice(maxTick) : 0), [maxTick]);
	const upperPrice = React.useMemo(
		() => (highPrice === INFINITE ? maxPrice : highPrice),
		[highPrice, maxPrice],
	);

	const handleAmountAInputChange = React.useCallback(
		event => {
			const inputValue = event.target.value;

			if (inputValue === '' || inputValue === '0') {
				setAmountA('');
				setAmountB('');
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setAmountA(inputValue);
				if (lowPrice && highPrice && pool) {
					if (Number(lowerPrice) > Number(price) && Number(upperPrice) > Number(price)) {
						setAmountB('0');
					} else {
						const amountB = calculateAmount1(inputValue, price, upperPrice, lowerPrice);
						setAmountB(amountB);
					}
				}
			}
		},
		[setAmountA, setAmountB, lowPrice, highPrice, pool, lowerPrice, price, upperPrice],
	);

	const handleAmountAMax = React.useCallback(
		max => {
			setAmountA(max);
		},
		[setAmountA],
	);

	const handleAmountBInputChange = React.useCallback(
		event => {
			const inputValue = event.target.value;

			if (inputValue === '' || inputValue === '0') {
				setAmountB('');
				setAmountA('');
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setAmountB(inputValue);
				if (lowPrice && highPrice && pool) {
					if (Number(lowerPrice) < Number(price) && Number(upperPrice) < Number(price)) {
						setAmountA('0');
					} else {
						const amountA = calculateAmount0(inputValue, price, upperPrice, lowerPrice);
						setAmountA(amountA);
					}
				}
			}
		},
		[setAmountB, setAmountA, lowPrice, highPrice, pool, lowerPrice, price, upperPrice],
	);

	const handleAmountBMax = React.useCallback(
		max => {
			setAmountB(max);
		},
		[setAmountB],
	);

	return (
		<div>
			{Number(lowerPrice) < Number(price) && Number(upperPrice) < Number(price) ? null : (
				<SwapTokenInput
					showMax={true}
					isLoading={isLoading}
					disableSelect={true}
					inputValue={amountA}
					onInputChange={handleAmountAInputChange}
					selectedToken={tokenA}
					onMaxClick={handleAmountAMax}
				/>
			)}

			<div style={{ height: '16px' }} />

			{Number(lowerPrice) > Number(price) && Number(upperPrice) > Number(price) ? null : (
				<SwapTokenInput
					showMax={true}
					isLoading={isLoading}
					disableSelect={true}
					inputValue={amountB}
					onInputChange={handleAmountBInputChange}
					selectedToken={tokenB}
					onMaxClick={handleAmountBMax}
				/>
			)}
		</div>
	);
}
