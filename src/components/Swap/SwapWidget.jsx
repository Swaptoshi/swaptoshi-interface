import React, { useState } from 'react';
import './Swap.css';
import * as cryptography from '@liskhq/lisk-cryptography';
import WalletActionButton from '../../components/Button/WalletActionButton';
import SwapTokenInput from './SwapTokenInput';
import { useDebouncedCallback } from 'use-debounce';
import { getPrice, getQuote } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import SlippageAndDeadlineConfig from '../Config/SlippageAndDeadlineConfig';
import SwapWarning from './SwapWarning';
import SwapDetailsInfo from './SwapDetailsInfo';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import BigNumber from 'bignumber.js';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import * as env from '../../utils/config/env';
import { getTransactionBytes } from '../../utils/transaction/bytes';
import { isFeeConversion } from '../../utils/transaction/fee';

const SwapWidget = ({ disabled, initialBaseToken, initialQuoteToken }) => {
	const { selectedService, feeConfig, dexConfig, chain } = useChain();
	const { balances, auth, senderPublicKey } = useWalletConnect();
	const { sendTransaction } = useTransactionModal();

	const [currentPrice, setCurrentPrice] = useState();
	const [feeConversion, setFeeConversion] = useState();
	const [feeConversionLoading, setFeeConversionLoading] = useState(false);

	const [slippage, setSlippage] = useState('');
	const [deadline, setDeadline] = useState('');

	const [baseToken, setBaseToken] = useState();
	const [baseValue, setBaseValue] = useState('');
	const [baseLoading, setBaseLoading] = useState(false);

	const [quoteToken, setQuoteToken] = useState();
	const [quoteValue, setQuoteValue] = useState('');
	const [quoteLoading, setQuoteLoading] = useState(false);

	const [error, setError] = useState();
	const [path, setPath] = useState();
	const [command, setCommand] = useState();

	const [networkFee, setNetworkFee] = useState();
	const [transaction, setTransaction] = useState();

	const baseBalance = React.useMemo(() => {
		if (baseToken && balances && balances.length > 0) {
			const foundToken = balances.find(t => t.tokenId === baseToken.tokenId);
			const foundBalance = foundToken ? Number(foundToken.balance) / 10 ** foundToken.decimal : 0;
			return foundBalance;
		}
		return 0;
	}, [balances, baseToken]);

	const feeBalance = React.useMemo(() => {
		if (baseToken && balances && balances.length > 0) {
			const foundToken = balances.find(t => t.tokenId === feeConfig.feeTokenID);
			const foundBalance = foundToken ? Number(foundToken.balance) / 10 ** foundToken.decimal : 0;
			return foundBalance;
		}
		return 0;
	}, [balances, baseToken, feeConfig]);

	const isFetchingPrice = React.useMemo(
		() => baseLoading || quoteLoading,
		[baseLoading, quoteLoading],
	);

	const isAllLoading = React.useMemo(
		() => isFetchingPrice || feeConversionLoading,
		[feeConversionLoading, isFetchingPrice],
	);

	const priceReady = React.useMemo(
		() =>
			baseToken !== undefined &&
			quoteToken !== undefined &&
			baseValue !== '' &&
			baseValue !== '0' &&
			quoteValue !== '' &&
			quoteValue !== '0',
		[baseToken, baseValue, quoteToken, quoteValue],
	);

	const isSwappable = React.useMemo(() => {
		return !error && !baseLoading && !quoteLoading && priceReady;
	}, [baseLoading, error, priceReady, quoteLoading]);

	const priceImpact = React.useMemo(() => {
		if (!baseLoading && !quoteLoading && priceReady) {
			return (baseValue / quoteValue - currentPrice) / currentPrice;
		} else {
			return 0;
		}
	}, [baseLoading, baseValue, currentPrice, priceReady, quoteLoading, quoteValue]);

	const updateNetworkFee = useDebouncedCallback(async transaction => {
		if (feeConfig) {
			const txBytes = await getTransactionBytes(transaction);
			const minFee = BigInt(txBytes.length) * BigInt(feeConfig.minFeePerByte);
			setNetworkFee(minFee.toString());
			setTransaction(tx => ({
				...tx,
				fee: minFee.toString(),
			}));
		} else {
			setError('Fee configuration not ready');
		}
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		if (disabled) return;

		const deadlineFactor = deadline ? deadline : Number(env.DEFAULT_DEADLINE_MINUTE);
		const slippageFactor = slippage ? slippage : Number(env.DEFAULT_SLIPPAGE);

		const senderBuffer = senderPublicKey ? Buffer.from(senderPublicKey, 'hex') : Buffer.alloc(32);
		const nonce = auth ? auth.nonce : '0';

		if (command === 'exactInput') {
			const amount = Number(quoteValue) * 10 ** quoteToken.decimal;
			const tx = {
				module: 'dex',
				command: 'exactInput',
				fee: '1000000',
				params: {
					path,
					recipient: cryptography.address.getAddressFromPublicKey(senderBuffer).toString('hex'),
					deadline: (Math.floor(Date.now() / 1000) + deadlineFactor * 60).toString(),
					amountIn: (Number(baseValue) * 10 ** baseToken.decimal).toString(),
					amountOutMinimum: new BigNumber(amount)
						.minus(new BigNumber(amount).multipliedBy(slippageFactor).dividedBy(100))
						.toFixed(0)
						.toString(),
				},
				nonce,
				senderPublicKey: senderBuffer.toString('hex'),
				signatures: new Array(auth ? auth.numberOfSignatures || 1 : 1).fill('0'.repeat(128)),
			};
			setTransaction(tx);
			updateNetworkFee(tx);
		}

		if (command === 'exactOutput') {
			const amount = Number(baseValue) * 10 ** baseToken.decimal;
			const tx = {
				module: 'dex',
				command: 'exactOutput',
				fee: '1000000',
				params: {
					path,
					recipient: cryptography.address.getAddressFromPublicKey(senderBuffer).toString('hex'),
					deadline: (Math.floor(Date.now() / 1000) + deadlineFactor * 60).toString(),
					amountOut: (Number(quoteValue) * 10 ** quoteToken.decimal).toString(),
					amountInMaximum: new BigNumber(amount)
						.plus(new BigNumber(amount).multipliedBy(slippageFactor).dividedBy(100))
						.toFixed(0)
						.toString(),
				},
				nonce,
				senderPublicKey: senderBuffer.toString('hex'),
				signatures: new Array(auth ? auth.numberOfSignatures || 1 : 1).fill('0'.repeat(128)),
			};
			setTransaction(tx);
			updateNetworkFee(tx);
		}
	}, [
		auth,
		baseToken,
		baseValue,
		command,
		deadline,
		disabled,
		path,
		quoteToken,
		quoteValue,
		senderPublicKey,
		slippage,
		updateNetworkFee,
	]);

	React.useEffect(() => {
		if (disabled) return;

		if (
			error &&
			[
				'Network error',
				'Insufficient liquidity for this trade',
				'Please try again later',
				'Fee configuration not ready',
			].includes(error)
		) {
			return;
		}

		if (!baseToken || !quoteToken) {
			setError('Select a token');
			return;
		}

		if (!baseValue && !quoteValue) {
			setError('Enter an amount');
			return;
		}

		if (baseToken && feeConfig && baseToken.tokenId === feeConfig.feeTokenID) {
			if (
				baseBalance !== undefined &&
				baseValue &&
				networkFee &&
				baseBalance < Number(baseValue) + Number(networkFee) / 10 ** env.WC_TOKEN_DECIMAL
			) {
				setError(`Insufficient ${baseToken.symbol.toUpperCase()} for fee`);
				return;
			}
		} else {
			if (baseBalance !== undefined && baseValue && baseBalance < Number(baseValue)) {
				setError(`Insufficient ${baseToken.symbol.toUpperCase()} balance`);
				return;
			}
		}

		if (feeConversion && feeConversion.status) {
			if (!feeConversion.payload.isEligible) {
				setError(`Insufficient ${feeConversion.payload.tokenIn} for fee`);
				return;
			}
		} else {
			if (
				feeBalance !== undefined &&
				networkFee &&
				feeBalance < Number(networkFee) / 10 ** env.WC_TOKEN_DECIMAL
			) {
				setError(`Insufficient ${env.WC_TOKEN_SYMBOL} for fee`);
				return;
			}
		}

		setError();
	}, [
		baseBalance,
		baseToken,
		baseValue,
		chain,
		disabled,
		error,
		feeBalance,
		feeConfig,
		feeConversion,
		networkFee,
		quoteToken,
		quoteValue,
	]);

	React.useEffect(() => {
		if (!priceReady) {
			setFeeConversion();
			setFeeConversionLoading(false);
			return;
		}

		const run = async () => {
			try {
				setFeeConversionLoading(true);
				const isConversion = await isFeeConversion(
					balances,
					senderPublicKey,
					baseValue,
					baseToken,
					networkFee,
					dexConfig,
					feeConfig,
					selectedService,
				);
				setFeeConversion(isConversion);
			} catch {
				setError('Please try again later');
			} finally {
				setFeeConversionLoading(false);
			}
		};

		run();
	}, [
		balances,
		baseToken,
		baseValue,
		dexConfig,
		feeConfig,
		networkFee,
		priceReady,
		selectedService,
		senderPublicKey,
	]);

	const fetchPrice = useDebouncedCallback(async () => {
		try {
			if (priceReady) {
				setError();
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
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		if (disabled) return;

		fetchPrice();
	}, [baseToken, disabled, fetchPrice, priceReady, quoteToken, selectedService]);

	React.useEffect(() => {
		if (initialBaseToken) {
			setBaseToken(initialBaseToken);
		}
		if (initialQuoteToken) {
			setQuoteToken(initialQuoteToken);
		}
	}, [initialBaseToken, initialQuoteToken]);

	const handleExactIn = useDebouncedCallback(async (baseToken, quoteToken, amountIn) => {
		try {
			setError();
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

				setCommand('exactInput');
				setPath(quote.data.path);
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
			setError();
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

				setCommand('exactOutput');
				setPath(quote.data.path);
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
				setError();
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
				setError();
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

		if (priceReady) {
			setBaseLoading(true);
			handleExactOut(baseToken, quoteToken, oldBaseValue);
		}

		if (
			baseToken !== undefined &&
			quoteToken !== undefined &&
			(baseValue === '' || baseValue === '0') &&
			quoteValue !== '' &&
			quoteValue !== '0'
		) {
			setQuoteLoading(true);
			handleExactIn(baseToken, quoteToken, quoteValue);
		}
	}, [baseToken, baseValue, handleExactIn, handleExactOut, priceReady, quoteToken, quoteValue]);

	const onSwapClick = React.useCallback(() => {
		sendTransaction({
			transaction,
			onSuccess: () => {
				setBaseValue('');
				setQuoteValue('');
				setError();
			},
		});
	}, [sendTransaction, transaction]);

	return (
		<React.Fragment>
			{disabled && (
				<div
					style={{
						position: 'absolute',
						width: '100%',
						maxWidth: '464px',
						borderRadius: '24px',
						height: '100%',
						zIndex: 10,
						backgroundColor: 'transparent',
					}}
				/>
			)}
			<div className={'card-bg'}>
				<div id="card-top" className="card-top-parent">
					<div id="btns-top" className="top-btns">
						<span className="swap-btn">Swap</span>
					</div>

					<SlippageAndDeadlineConfig
						slippage={slippage}
						setSlippage={setSlippage}
						deadline={deadline}
						setDeadline={setDeadline}
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
						showMax={true}
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
						showMax={false}
					/>

					<div style={{ marginTop: '4px' }} />

					<SwapDetailsInfo
						isLoading={isFetchingPrice}
						command={command}
						priceImpact={priceImpact}
						priceReady={priceReady}
						isSlippageAuto={!slippage}
						slippage={slippage}
						baseToken={baseToken}
						baseValue={baseValue}
						quoteToken={quoteToken}
						quoteValue={quoteValue}
						networkFee={networkFee}
						feeConversion={feeConversion}
					/>

					<div style={{ marginTop: '4px' }} />

					<SwapWarning priceImpact={priceImpact} />

					<div style={{ marginTop: '4px' }} />

					<WalletActionButton
						loading={isAllLoading ? 'true' : undefined}
						disabled={!isSwappable}
						onClick={() => onSwapClick(transaction)}
						style={{ width: '100%', height: '60px', borderRadius: '16px' }}
					>
						{error ? error : 'Swap'}
					</WalletActionButton>
				</div>
			</div>
		</React.Fragment>
	);
};

export default SwapWidget;
