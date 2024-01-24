import React from 'react';
import TradableTokenPicker from '../../components/Token/TradableTokenPicker';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import { useDebouncedCallback } from 'use-debounce';
import { getPrice } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/toast/tryToast';
import * as env from '../../utils/config/env';

export default function SwapTokenInput({
	title,
	isLoading,
	disableSelect,
	inputValue,
	onInputChange,
	selectedToken,
	blockedToken,
	onTokenSelect,
	onMaxClick,
	showMax,
}) {
	const { balances, senderPublicKey } = useWalletConnect();
	const { chain, selectedService } = useChain();
	const { prices, fiatFormatter } = useLiskPrice();
	const [selectedBalance, setSelectedBalance] = React.useState();
	const [selectedFiatValue, setSelectedFiatValue] = React.useState();
	const [isFetchingPrice, setIsFectingPrice] = React.useState(false);

	const fetchFiatPrice = useDebouncedCallback(async (amount, tokenId, lskPrice) => {
		await tryToast(
			'Quote price failed',
			async () => {
				const tokenToLskPrice = await getPrice(
					{
						baseTokenId: tokenId,
						quoteTokenId: `${chain}00000000000000`,
					},
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (tokenToLskPrice && tokenToLskPrice.data) {
					setSelectedFiatValue(Number(amount) * tokenToLskPrice.data.price * lskPrice);
				}
				setIsFectingPrice(false);
			},
			() => setIsFectingPrice(false),
		);
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	const onSelect = React.useCallback(
		selected => {
			onTokenSelect(selected);
			if (inputValue) {
				fetchFiatPrice(inputValue, selected.tokenId, prices);
			}
		},
		[fetchFiatPrice, inputValue, onTokenSelect, prices],
	);

	const handleInputChange = React.useCallback(
		e => {
			onInputChange(e);
		},
		[onInputChange],
	);

	const handleMaxClick = React.useCallback(() => {
		onMaxClick(selectedBalance);
		handleInputChange({ target: { value: selectedBalance } });
	}, [handleInputChange, onMaxClick, selectedBalance]);

	React.useEffect(() => {
		setSelectedBalance();
		if (senderPublicKey && selectedToken && balances) {
			const foundBalance = balances.find(t => t.tokenId === selectedToken.tokenId);
			setSelectedBalance(
				foundBalance ? Number(foundBalance.balance) / 10 ** foundBalance.decimal : 0,
			);
		}
	}, [balances, selectedToken, senderPublicKey]);

	React.useEffect(() => {
		if (inputValue === '') {
			setSelectedFiatValue();
			return;
		}
		if (selectedToken && inputValue !== '') {
			setIsFectingPrice(true);
			fetchFiatPrice(inputValue, selectedToken.tokenId, prices);
		}
	}, [fetchFiatPrice, inputValue, prices, selectedToken]);

	return (
		<div className="you-pay" style={{ opacity: isLoading ? 0.5 : 1 }}>
			{isLoading && (
				<div
					style={{
						position: 'absolute',
						zIndex: 10,
						backgroundColor: 'transparent',
						width: '100%',
						height: '100%',
					}}
				/>
			)}
			<div id="swap-currency-input" className="swap-currency" style={{ padding: '16px' }}>
				<div className="input-wrapper">
					{title ? (
						<label className="youPay-label" style={{ marginBottom: '4px' }}>
							{title}
						</label>
					) : null}
					<div className="paying-wrapper">
						<input
							id="token-amount"
							className="token-amount-input"
							inputMode="numeric"
							autoComplete="off"
							autoCorrect="off"
							type="text"
							name="you-pay"
							placeholder="0"
							minLength="1"
							maxLength="79"
							spellCheck="false"
							value={inputValue}
							onChange={handleInputChange}
						/>

						<div>
							{
								<TradableTokenPicker
									disableSelect={disableSelect}
									value={selectedToken}
									blocked={blockedToken}
									onSelect={onSelect}
									theme={'secondary'}
								/>
							}
						</div>
					</div>
					<div style={{ display: 'flex', flexDirection: 'row', marginTop: '4px' }}>
						<div
							style={{
								flex: 1,
								width: '50%',
								textAlign: 'left',
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
						>
							{isFetchingPrice
								? '-'
								: selectedFiatValue
									? fiatFormatter.format(selectedFiatValue.toFixed(2))
									: '-'}
						</div>
						{selectedBalance !== undefined && (
							<div
								style={{
									flex: 1,
									width: '50%',
									justifyContent: 'right',
									display: 'flex',
									flexDirection: 'row',
								}}
							>
								<div
									style={{
										textOverflow: 'ellipsis',
										overflow: 'hidden',
										whiteSpace: 'nowrap',
									}}
								>
									Balance: {selectedBalance.toFixed(2)}
								</div>
								{selectedBalance !== inputValue && selectedBalance > 0 && showMax && (
									<button
										style={{
											marginLeft: '8px',
											fontWeight: 600,
											border: 0,
											backgroundColor: 'transparent',
											color: 'var(--primary)',
										}}
										onClick={handleMaxClick}
									>
										MAX
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
