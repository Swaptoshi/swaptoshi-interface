import React, { useState } from 'react';
import './Swap.css';
import WalletActionButton from '../../components/Button/WalletActionButton';
import SwapTokenInput from './SwapTokenInput';
import { useDebouncedCallback } from 'use-debounce';
import { getPrice, getQuote } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { liskTokenCompact } from '../../constants/tokens';
import SwapConfig from './SwapConfig';
import SwapWarning from './SwapWarning';
import SwapDetailsInfo from './SwapDetailsInfo';

const Swap = () => {
	const { selectedService } = useChain();

	const [currentPrice, setCurrentPrice] = useState();

	const [showSwapSetting, setShowSwapSetting] = useState(false);
	const [isSlippageAuto, setIsSlippageAuto] = useState(true);
	const [slippage, setSlippage] = useState();
	const [deadline, setDeadline] = useState();

	const [baseToken, setBaseToken] = useState();
	const [baseValue, setBaseValue] = useState('');
	const [baseLoading, setBaseLoading] = useState(false);

	const [quoteToken, setQuoteToken] = useState();
	const [quoteValue, setQuoteValue] = useState('');
	const [quoteLoading, setQuoteLoading] = useState(false);

	const [error, setError] = useState();

	const isFetchingPrice = React.useMemo(
		() => baseLoading || quoteLoading,
		[baseLoading, quoteLoading],
	);

	const priceReady = React.useMemo(
		() =>
			baseToken !== undefined &&
			quoteToken !== undefined &&
			((baseValue !== '' && baseValue !== '0') || (quoteValue !== '' && quoteValue !== '0')),
		[baseToken, baseValue, quoteToken, quoteValue],
	);

	const isSwappable = React.useMemo(() => {
		return !error && !baseLoading && !quoteLoading && priceReady;
	}, [baseLoading, error, priceReady, quoteLoading]);

	const priceImpact = React.useMemo(() => {
		if (isSwappable) {
			return (baseValue / quoteValue - currentPrice) / currentPrice;
		} else {
			return 0;
		}
	}, [baseValue, currentPrice, isSwappable, quoteValue]);

	React.useEffect(() => {
		const run = async () => {
			try {
				if (priceReady) {
					const price = await getPrice(
						{
							baseTokenId: quoteToken.tokenId,
							quoteTokenId: baseToken.tokenId,
						},
						selectedService ? selectedService.serviceURLs : undefined,
					);
					if (price && price.data) {
						setCurrentPrice(price.data.price);
					} else {
						setError('Please try again later');
					}
				}
			} catch {
				setError('Please try again later');
			}
		};

		run();
	}, [baseToken, priceReady, quoteToken, selectedService]);

	React.useEffect(() => {
		setBaseToken(liskTokenCompact);
	}, []);

	const handleExactIn = useDebouncedCallback(async (baseToken, quoteToken, amountIn) => {
		try {
			const quote = await getQuote(
				{
					base: baseToken.tokenId,
					quote: quoteToken.tokenId,
					amountIn: Math.floor(Number(amountIn) * 10 ** baseToken.decimal),
				},
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (quote && quote.data) {
				const value = Number(quote.data.amount) / 10 ** quoteToken.decimal;
				setQuoteValue(value);
				handleQuoteInputChange({ target: { event: value } });
				setError();
			} else {
				setQuoteValue('');
				handleQuoteInputChange({ target: { event: '' } });
				setError('Please try again later');
			}
		} catch (err) {
			setQuoteValue('');
			handleQuoteInputChange({ target: { event: '' } });
			if (err.message === 'Network Error') {
				setError('Network error');
			} else {
				setError('Insufficient liquidity for this trade');
			}
		} finally {
			setQuoteLoading(false);
		}
	}, 500);

	const handleExactOut = useDebouncedCallback(async (baseToken, quoteToken, amountOut) => {
		try {
			const quote = await getQuote(
				{
					base: baseToken.tokenId,
					quote: quoteToken.tokenId,
					amountOut: Math.floor(Number(amountOut) * 10 ** quoteToken.decimal),
				},
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (quote && quote.data) {
				const value = Number(quote.data.amount) / 10 ** baseToken.decimal;
				setBaseValue(value);
				handleBaseInputChange({ target: { event: value } });
				setError();
			} else {
				setBaseValue('');
				handleBaseInputChange({ target: { event: '' } });
				setError('Please try again later');
			}
		} catch (err) {
			setBaseValue('');
			handleBaseInputChange({ target: { event: '' } });
			if (err.message === 'Network Error') {
				setError('Network error');
			} else {
				setError('Insufficient liquidity for this trade');
			}
		} finally {
			setBaseLoading(false);
		}
	}, 500);

	const onSelectBaseToken = React.useCallback(
		selected => {
			setBaseToken(selected);
			if (baseValue && quoteToken) {
				setQuoteLoading(true);
				handleExactIn(selected, quoteToken, baseValue);
				return;
			}
			if (quoteValue && quoteToken) {
				setBaseLoading(true);
				handleExactOut(quoteToken, selected, quoteValue);
				return;
			}
		},
		[baseValue, handleExactIn, handleExactOut, quoteToken, quoteValue],
	);

	const onSelectQuoteToken = React.useCallback(
		selected => {
			setQuoteToken(selected);
			if (quoteValue && baseToken) {
				setBaseLoading(true);
				handleExactOut(selected, baseToken, quoteValue);
				return;
			}
			if (baseValue && baseToken) {
				setQuoteLoading(true);
				handleExactIn(baseToken, selected, baseValue);
				return;
			}
		},
		[baseToken, baseValue, handleExactIn, handleExactOut, quoteValue],
	);

	const handleBaseMax = React.useCallback(max => {
		setBaseValue(max);
	}, []);

	const handleQuoteMax = React.useCallback(max => {
		setQuoteValue(max);
	}, []);

	const handleBaseInputChange = React.useCallback(
		event => {
			const inputValue = event.target.value;

			if (inputValue === '' || inputValue === '0') {
				setBaseValue('');
				setQuoteValue('');
				setError(false);
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setBaseValue(inputValue);
				if (baseToken && quoteToken) {
					setQuoteLoading(true);
					handleExactIn(baseToken, quoteToken, inputValue);
				}
			}
		},
		[baseToken, handleExactIn, quoteToken],
	);

	const handleQuoteInputChange = React.useCallback(
		event => {
			const inputValue = event.target.value;

			if (inputValue === '' || inputValue === '0') {
				setBaseValue('');
				setQuoteValue('');
				setError(false);
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setQuoteValue(inputValue);
				if (baseToken && quoteToken) {
					setBaseLoading(true);
					handleExactOut(quoteToken, baseToken, inputValue);
				}
			}
		},
		[baseToken, handleExactOut, quoteToken],
	);

	const switchHandler = React.useCallback(() => {
		const oldBaseToken = baseToken;
		const oldBaseValue = baseValue;

		setBaseToken(quoteToken);
		setBaseValue(quoteValue);
		setQuoteToken(oldBaseToken);
		setQuoteValue(oldBaseValue);

		if (baseToken && quoteToken) {
			setBaseLoading(true);
			handleExactOut(baseToken, quoteToken, oldBaseValue);
		}
	}, [baseToken, baseValue, handleExactOut, quoteToken, quoteValue]);

	const onConfigClick = React.useCallback(() => {
		setShowSwapSetting(s => !s);
	}, []);

	const onSlippageInputChange = React.useCallback(event => {
		const inputValue = event.target.value;

		if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
			setSlippage(inputValue);
		}
	}, []);

	const onDeadlineInputChange = React.useCallback(event => {
		const inputValue = event.target.value;

		if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
			setDeadline(inputValue);
		}
	}, []);

	return (
		<React.Fragment>
			<div className="swap-wrapper">
				<div className="card-section">
					<main className="card-bg">
						<div id="card-top" className="card-top-parent">
							<div id="btns-top" className="top-btns">
								<span className="swap-btn">Swap</span>
							</div>

							<SwapConfig
								show={showSwapSetting}
								onClick={onConfigClick}
								isSlippageAuto={isSlippageAuto}
								setIsSlippageAuto={setIsSlippageAuto}
								slippage={slippage}
								onSlippageInputChange={onSlippageInputChange}
								deadline={deadline}
								onDeadlineInputChange={onDeadlineInputChange}
							/>
						</div>

						<div style={{ marginTop: '4px' }} />

						{/* You Pay Tab */}
						<div>
							<SwapTokenInput
								title={'You pay'}
								isLoading={baseLoading}
								inputValue={baseValue}
								onInputChange={handleBaseInputChange}
								selectedToken={baseToken}
								blockedToken={quoteToken}
								onTokenSelect={onSelectBaseToken}
								onMaxClick={handleBaseMax}
							/>

							<div className="switch-button" onClick={switchHandler}>
								<div className="switch-bg">
									<i className="arrow-down ri-arrow-down-line"></i>
								</div>
							</div>

							<SwapTokenInput
								title={'You receive'}
								isLoading={quoteLoading}
								inputValue={quoteValue}
								onInputChange={handleQuoteInputChange}
								selectedToken={quoteToken}
								blockedToken={baseToken}
								onTokenSelect={onSelectQuoteToken}
								onMaxClick={handleQuoteMax}
							/>

							<div style={{ marginTop: '4px' }} />

							<SwapDetailsInfo
								isLoading={isFetchingPrice}
								priceImpact={priceImpact}
								priceReady={priceReady}
								isSlippageAuto={isSlippageAuto}
								slippage={slippage}
								baseToken={baseToken}
								baseValue={baseValue}
								quoteToken={quoteToken}
								quoteValue={quoteValue}
							/>

							<div style={{ marginTop: '4px' }} />

							<SwapWarning priceImpact={priceImpact} />

							<div style={{ marginTop: '4px' }} />

							<WalletActionButton
								disabled={!isSwappable}
								style={{ width: '100%', height: '60px', borderRadius: '16px' }}
							>
								{error ? error : 'Swap'}
							</WalletActionButton>
						</div>
					</main>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Swap;
