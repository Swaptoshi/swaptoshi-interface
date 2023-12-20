import React, { useState } from 'react';
import './Swap.css';
import WalletActionButton from '../../components/Button/WalletActionButton';
import SwapTokenInput from './SwapTokenInput';
import { useDebouncedCallback } from 'use-debounce';
import { getQuote } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/Toast/tryToast';
import Tooltip from '../../components/Tooltip/Tooltip';
import Dialog from '../../components/Tooltip/Dialog';
import { liskTokenCompact } from '../../constants/tokens';

const Swap = () => {
	const { selectedService } = useChain();

	const [showSwapSetting, setShowSwapSetting] = useState(false);

	const [baseToken, setBaseToken] = useState();
	const [baseValue, setBaseValue] = useState('');
	const [baseLoading, setBaseLoading] = useState(false);

	const [quoteToken, setQuoteToken] = useState();
	const [quoteValue, setQuoteValue] = useState('');
	const [quoteLoading, setQuoteLoading] = useState(false);

	React.useEffect(() => {
		setBaseToken(liskTokenCompact);
	}, []);

	const handleExactIn = useDebouncedCallback(async (baseToken, quoteToken, amountIn) => {
		await tryToast(
			'Quote price failed',
			async () => {
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
				}
			},
			undefined,
			() => setQuoteLoading(false),
		);
	}, 500);

	const handleExactOut = useDebouncedCallback(async (baseToken, quoteToken, amountOut) => {
		await tryToast(
			'Quote price failed',
			async () => {
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
				}
			},
			undefined,
			() => setBaseLoading(false),
		);
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

			if (inputValue === '') {
				setBaseValue('');
				setQuoteValue('');
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

			if (inputValue === '') {
				setBaseValue('');
				setQuoteValue('');
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

	return (
		<React.Fragment>
			<div className="swap-wrapper">
				<div className="card-section">
					<main className="card-bg">
						<div id="card-top" className="card-top-parent">
							<div id="btns-top" className="top-btns">
								<span className="swap-btn">Swap</span>
							</div>

							<div className="gear">
								<Dialog
									show={showSwapSetting}
									style={{ right: 0, width: 100, height: 200 }}
									anchor={
										<button
											className="gear-btn"
											onClick={onConfigClick}
											style={{ borderRadius: '24px', overflow: 'hidden' }}
										>
											<div
												style={{
													display: 'flex',
													backgroundColor: 'var(--yellow-transparent)',
													padding: '2px 8px',
													alignItems: 'center',
												}}
											>
												<div style={{ color: 'var(--text-clr)', fontSize: '14px' }}>
													Slippage 1.0%
												</div>
												<i className="ri-settings-3-fill gear-icon"></i>
											</div>
										</button>
									}
								>
									<div>testooo</div>
								</Dialog>
							</div>
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

							<div
								style={{
									border: '1px solid var(--border)',
									borderRadius: '16px',
									padding: '12px 16px',
									fontSize: '14px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div className="text" style={{ width: 'fit-content', flex: 1 }}>
										fecthing price
									</div>
									<div className="text" style={{ fontSize: '18px' }}>
										<i className="ri-arrow-down-s-line"></i>
									</div>
								</div>

								<div>
									<div
										style={{ height: '1px', backgroundColor: 'var(--border)', marginTop: '12px' }}
									/>

									<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
										<div
											className="text"
											style={{ width: 'fit-content', flex: 1, color: 'var(--text-color)' }}
										>
											Price impact
										</div>
										<div className="text">1.12%</div>
									</div>

									<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0' }}>
										<div
											className="text"
											style={{ width: 'fit-content', flex: 1, color: 'var(--text-color)' }}
										>
											Price impact
										</div>
										<div className="text">1.12%</div>
									</div>

									<div style={{ display: 'flex', alignItems: 'center', margin: '12px 0 0 0' }}>
										<div
											className="text"
											style={{
												width: 'fit-content',
												flex: 1,
												display: 'flex',
												color: 'var(--text-color)',
											}}
										>
											Price impact
											<Tooltip content={'This is a new tooltip that we just created'}>
												<i style={{ margin: '0 2px' }} className="ri-information-line"></i>
											</Tooltip>
										</div>
										<div className="text">1.12%</div>
									</div>
								</div>
							</div>

							<div style={{ marginTop: '4px' }} />

							<div
								style={{
									border: '1px solid var(--red)',
									borderRadius: '16px',
									padding: '12px 16px',
									fontSize: '14px',
								}}
							>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<div
										className="text"
										style={{ width: 'fit-content', flex: 1, color: 'var(--red)' }}
									>
										Price impact warning
									</div>
									<div className="text" style={{ color: 'var(--red)' }}>
										12.213%
									</div>
								</div>
							</div>

							<div style={{ marginTop: '4px' }} />

							<WalletActionButton style={{ width: '100%', height: '60px', borderRadius: '16px' }}>
								Swap
							</WalletActionButton>
						</div>
					</main>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Swap;
