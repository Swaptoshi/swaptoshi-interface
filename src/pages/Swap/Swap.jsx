import React, { useState } from 'react';
import './Swap.css';
import WalletActionButton from '../../components/Button/WalletActionButton';
import SwapTokenInput from './SwapTokenInput';

const Swap = () => {
	const [baseToken, setBaseToken] = useState();
	const [quoteToken, setQuoteToken] = useState();

	const [baseValue, setBaseValue] = useState('');
	const [quoteValue, setQuoteValue] = useState('');

	const onSelectBaseToken = React.useCallback(selected => {
		setBaseToken(selected);
	}, []);

	const onSelectQuoteToken = React.useCallback(selected => {
		setQuoteToken(selected);
	}, []);

	const handleBaseMax = max => {
		setBaseValue(max);
	};

	const handleQuoteMax = max => {
		setQuoteValue(max);
	};

	const handleBaseInputChange = event => {
		const inputValue = event.target.value;

		if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
			setBaseValue(inputValue);
		}
	};

	const handleQuoteInputChange = event => {
		const inputValue = event.target.value;

		if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
			setQuoteValue(inputValue);
		}
	};

	const switchHandler = () => {
		console.log('switch');
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
							<SwapTokenInput
								title={'You pay'}
								inputValue={baseValue}
								onInputChange={handleBaseInputChange}
								selectedToken={baseToken}
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
								inputValue={quoteValue}
								onInputChange={handleQuoteInputChange}
								selectedToken={quoteToken}
								onTokenSelect={onSelectQuoteToken}
								onMaxClick={handleQuoteMax}
							/>

							<WalletActionButton style={{ width: '100%', height: '60px' }}>
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
