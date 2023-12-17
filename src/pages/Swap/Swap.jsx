import React, { useState } from 'react';
import './Swap.css';
import WalletActionButton from '../../components/Button/WalletActionButton';
import TradableTokenPicker from '../../components/Token/TradableTokenPicker';

const Swap = () => {
	const [inputValues, setInputValues] = useState({
		'you-pay': '',
		'you-receive': '',
	});

	const [etheriumId, setEtheriumId] = useState('ethId');
	const [tokenId, setTokenId] = useState('tokenId');

	const handleInputChange = event => {
		const inputValue = event.target.value;
		const inputName = event.target.name;

		if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
			setInputValues(prevInputValues => ({
				...prevInputValues,
				[inputName]: inputValue,
			}));
		}
	};

	const switchHandler = () => {
		const temp = etheriumId;
		setEtheriumId(tokenId);
		setTokenId(temp);
	};

	return (
		<React.Fragment>
			<div className="swap-wrapper">
				<div className="card-section">
					<main className="card-bg">
						<div id="card-top" className="card-top-parent">
							<div id="btns-top" className="top-btns">
								<span className="swap-btn">Swap</span>
								<div className="buy">
									<button id="btn-id" className="buy-btn">
										Buy
									</button>
								</div>
							</div>

							<div className="gear">
								<button className="gear-btn">
									<div>
										<i className="ri-settings-3-fill gear-icon"></i>
									</div>
								</button>
							</div>
						</div>

						{/* You Pay Tab */}
						<div>
							<div className="you-pay">
								<div id="swap-currency-input" className="swap-currency">
									<div className="input-wrapper">
										<label className="youPay-label">You pay</label>
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
												value={inputValues['you-pay']}
												onChange={handleInputChange}
											/>

											<div id={etheriumId}>
												{
													<TradableTokenPicker
														value={undefined}
														onClose={() => console.log('closed')}
														onSelect={item => console.log(item)}
													/>
												}
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="switch-button" onClick={switchHandler}>
								<div className="switch-bg">
									<i className="arrow-down ri-arrow-down-line"></i>
								</div>
							</div>

							<div className="grid">
								<div className="you-receive">
									<div id="swap-currency-input" className="swap-currency">
										<div className="input-wrapper">
											<label className="youPay-label">You receive</label>
											<div className="paying-wrapper">
												<input
													id="token-amount"
													className="token-amount-input"
													inputMode="numeric"
													autoComplete="off"
													autoCorrect="off"
													name="you-receive"
													type="text"
													placeholder="0"
													minLength="1"
													maxLength="79"
													spellCheck="false"
													value={inputValues['you-receive']}
													onChange={handleInputChange}
												/>

												<div id={tokenId}>
													{
														<TradableTokenPicker
															value={undefined}
															onClose={() => console.log('closed')}
															onSelect={item => console.log(item)}
														/>
													}
												</div>
											</div>
										</div>
									</div>
								</div>
								<div>
									<WalletActionButton style={{ width: '100%', height: '60px' }}>
										Swap
									</WalletActionButton>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Swap;
