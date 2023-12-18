import React from 'react';
import TradableTokenPicker from '../../components/Token/TradableTokenPicker';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import { useDebouncedCallback } from 'use-debounce';
import { getPrice } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';

export default function SwapTokenInput({
	title,
	inputValue,
	onInputChange,
	selectedToken,
	onTokenSelect,
	onMaxClick,
}) {
	const { balances } = useWalletConnect();
	const { chain } = useChain();
	const { prices, fiatFormatter } = useLiskPrice();
	const [selectedBalance, setSelectedBalance] = React.useState();
	const [selectedFiatValue, setSelectedFiatValue] = React.useState();
	const [isFetchingPrice, setIsFectingPrice] = React.useState(false);

	const onSelect = React.useCallback(
		selected => {
			onTokenSelect(selected);
			if (balances && balances.length > 0) {
				const foundBalance = balances.find(t => t.tokenId === selected.tokenId);
				setSelectedBalance(
					foundBalance ? Number(foundBalance.balance) / 10 ** foundBalance.decimal : 0,
				);
			}
		},
		[balances, onTokenSelect],
	);

	const fetchFiatPrice = useDebouncedCallback(async (amount, tokenId, lskPrice) => {
		const tokenToLskPrice = await getPrice({
			baseTokenId: tokenId,
			quoteTokenId: `${chain}00000000000000`,
		});
		if (tokenToLskPrice && tokenToLskPrice.data) {
			console.log(Number(amount));
			setSelectedFiatValue(Number(amount) * tokenToLskPrice.data.price * lskPrice);
		}
		setIsFectingPrice(false);
	}, 500);

	const handleInputChange = React.useCallback(
		e => {
			onInputChange(e);
			if (selectedToken) {
				setIsFectingPrice(true);
				fetchFiatPrice(e.target.value, selectedToken.tokenId, prices);
			}
		},
		[fetchFiatPrice, onInputChange, prices, selectedToken],
	);

	const handleMaxClick = React.useCallback(() => {
		onMaxClick(selectedBalance);
		handleInputChange({ target: { value: selectedBalance } });
	}, [handleInputChange, onMaxClick, selectedBalance]);

	return (
		<div className="you-pay">
			<div id="swap-currency-input" className="swap-currency">
				<div className="input-wrapper">
					<label className="youPay-label" style={{ marginBottom: '4px' }}>
						{title}
					</label>
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

						<div>{<TradableTokenPicker value={selectedToken} onSelect={onSelect} />}</div>
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
									? fiatFormatter.format(selectedFiatValue)
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
								{selectedBalance !== inputValue && (
									<button
										style={{
											marginLeft: '8px',
											fontWeight: 600,
											border: 0,
											backgroundColor: 'transparent',
											color: 'var(--btn-color)',
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
