import React, { useEffect, useState } from 'react';
import SwapModal from '../../components/SwapModal/SwapModal';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import BarChart from './BarChart/BarChart';

const LiquidityModal = ({
	swapTokens,
	handleSwapModal,
	swapModal,
	setSwapModal,
	handleSelect,
	currentCurrencyId,
	setCurrentCurrencyId,
	liquidityTokenOne,
	liquidityTokenTwo,
	isLiquidityTokenSelected,
	minInputValue,
	maxInputValue,
}) => {
	const [, setData] = useState([]);

	const fetchData = async () => {
		try {
			const response = await axios.get('https://mocki.io/v1/5aee862d-4403-46a6-8b57-948563486117');
			setData(response.data);
		} catch (error) {
			console.error('Error:', error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	// console.log(selectedToken)
	const [hideButton, setHideButton] = useState(false);

	// const [minInputValue, setMinInputValue] = useState("320,323")
	// const [maxInputValue, setMaxInputValue] = useState("160,304")

	// const handleInputValue = (e) => {

	// }

	const handleButtonHide = () => {
		setHideButton(prev => !prev);
	};

	const renderLiquidityButtonContent = currencyId => {
		let currentToken = currencyId === 'liquidityEthId' ? liquidityTokenOne : liquidityTokenTwo;
		if (
			currencyId === 'liquidityEthId' ||
			(currencyId !== 'liquidityEthId' && currentToken?.symbol !== 'Select Token')
		) {
			return (
				<button
					id={`open-currency-select-${currencyId}`}
					className={`sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 CurrencyInputPanel__CurrencySelect-sc-73f91aaf-2 hWKjgZ jAJJVP hcUXCv ${
						currencyId === 'liquidityEthId'
							? 'open-currency-selected-top'
							: 'open-currency-selected-bottom'
					}`}
					onClick={() => handleSwapModal(currencyId)}
				>
					<span className="CurrencyInputPanel__Aligner-sc-73f91aaf-6 kkiXeD">
						<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 hJYFVB gOYHMo jeYuAz">
							<div
								className="AssetLogo__LogoContainer-sc-1d2e0d12-3 hOvXWG"
								style={{
									height: 24,
									width: 24,
									marginRight: '0.5rem',
								}}
							>
								<div className="AssetLogo__LogoImageWrapper-sc-1d2e0d12-2 iZhrtN">
									<img
										src={currentToken?.imgSrc}
										alt="ETH logo"
										className="AssetLogo__LogoImage-sc-1d2e0d12-1 IJysW"
									/>
								</div>
							</div>
							<span className="CurrencyInputPanel__StyledTokenName-sc-73f91aaf-8 reOdD token-symbol-container colorrr">
								{currentToken?.symbol}
							</span>
						</div>
						<div className="dropdown-icon">
							<i className="ri-arrow-down-s-line"></i>
						</div>
					</span>
				</button>
			);
		} else {
			return (
				<button
					id={`open-currency-select-${currencyId}`}
					className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 CurrencyInputPanel__CurrencySelect-sc-73f91aaf-2 hWKjgZ jAJJVP iGQvak open-currency-selected-bottom"
					onClick={() => handleSwapModal(currencyId)}
				>
					<span className="CurrencyInputPanel__Aligner-sc-73f91aaf-6 kkiXeD">
						<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 hJYFVB gOYHMo jeYuAz">
							<span className="CurrencyInputPanel__StyledTokenName-sc-73f91aaf-8 reOdD token-symbol-container">
								Select a token
							</span>
						</div>
						<div className="dropdown-icon">
							<i className="ri-arrow-down-s-line"></i>
						</div>
					</span>
				</button>
			);
		}
	};

	return (
		<div>
			<div className="App__BodyWrapper-sc-7e45ae4f-0 clIMsa">
				<div className="styled__ScrollablePage-sc-a3e32a7b-1 kVNjZg">
					<main
						className={`AppBody_BodyWrapper-sc-19e20e47-0 AddLiquidity_StyledBodyWrapper-sc-91848848-0 GfTH ${
							hideButton ? 'FuZnx-expanded' : 'FuZnx'
						}`}
					>
						<div className="NavigationTabs__Tabs-sc-b4540a6e-0 kmmojd">
							<div
								className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr"
								style={{ padding: '1rem 1rem 0px' }}
							>
								<NavLink
									flex={1}
									className="NavigationTabs__StyledLink-sc-b4540a6e-1 dIAqzj"
									to="/pools"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={24}
										height={24}
										viewBox="0 0 24 24"
										fill="none"
										stroke="#98A1C0"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="NavigationTabs__StyledArrowLeft-sc-b4540a6e-3 jpkEeW"
									>
										<line x1={19} y1={12} x2={5} y2={12} />
										<polyline points="12 19 5 12 12 5" />
									</svg>
								</NavLink>
								<div className="text__TextWrapper-sc-9327e48a-0 blhgKn NavigationTabs__AddRemoveTitleText-sc-b4540a6e-4 cMHLWt css-12uvan3">
									Add Liquidity
								</div>
								<div className="css-vurnku" style={{ marginRight: '0.5rem' }}>
									<div
										className="sc-bczRLJ Row-sc-34df4f97-0 fgCeff gOYHMo"
										style={{ width: 'fit-content', minWidth: 'fit-content' }}
									>
										<div className="styled__MediumOnly-sc-a3e32a7b-6 cYrhOe">
											<button className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonText-sc-4f96dcd8-9 hWKjgZ jtnClT">
												<div className="text__TextWrapper-sc-9327e48a-0 cWDToC css-15li2d9">
													Clear All
												</div>
											</button>
										</div>
									</div>
								</div>
								<div className="Settings__Menu-sc-6676197f-0 imhdhD">
									<button
										id="open-settings-dialog-button"
										data-testid="open-settings-dialog-button"
										aria-label="Transaction Settings"
										className="MenuButton__Button-sc-773d3ba1-1 kHIRPQ"
									>
										<div className="sc-bczRLJ Row-sc-34df4f97-0 MenuButton__IconContainer-sc-773d3ba1-2 hJYFVB gOYHMo hrkQLI">
											<i className="text-white  ri-settings-3-fill"></i>
										</div>
									</button>
								</div>
							</div>
						</div>

						<div className="styled__Wrapper-sc-a3e32a7b-0 vSeCC">
							<div className="styled__ResponsiveTwoColumns-sc-a3e32a7b-5 dXokMm">
								<div className="Column__AutoColumn-sc-72c388fb-2 ereGUg">
									<div className="Column__AutoColumn-sc-72c388fb-2 erfjwt">
										<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 eYHTYx gOYHMo BkVYr">
											<div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1lohbqv">
												Select Pair
											</div>
										</div>
										<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
											<div
												id="add-liquidity-input-tokena "
												className="CurrencyInputPanel__InputPanel-sc-73f91aaf-0 bhoFAK styled__CurrencyDropdown-sc-a3e32a7b-3 gkamEi"
											>
												<div className="CurrencyInputPanel__Container-sc-73f91aaf-1 epZvyg">
													<div
														id="liquidityEthId"
														className="CurrencyInputPanel__InputRow-sc-73f91aaf-3 jGjrwu"
														style={{ padding: 0, borderRadius: 8 }}
													>
														{/* ETH BUTTON */}
														{renderLiquidityButtonContent('liquidityEthId')}
													</div>
												</div>
											</div>
											<div style={{ width: 12 }} />
											<div
												id="add-liquidity-input-tokenb "
												className="CurrencyInputPanel__InputPanel-sc-73f91aaf-0 bhoFAK styled__CurrencyDropdown-sc-a3e32a7b-3 gkamEi"
											>
												<div className="CurrencyInputPanel__Container-sc-73f91aaf-1 epZvyg">
													<div
														id="liquidityTokenId"
														className="CurrencyInputPanel__InputRow-sc-73f91aaf-3 jGjrwu"
														style={{ padding: 0, borderRadius: 8 }}
													>
														{/* Select A token BUTTON */}
														{renderLiquidityButtonContent('liquidityTokenId')}
													</div>
												</div>
											</div>
										</div>
										<div className="Column__AutoColumn-sc-72c388fb-2 ereioh">
											<div
												disabled=""
												className={`Column__AutoColumn-sc-72c388fb-2 styled__DynamicSection-sc-a3e32a7b-2 erfjwt isLiqudity ${
													isLiquidityTokenSelected ? 'token-selected' : ''
												}`}
											>
												<div className="sc-bczRLJ Card-sc-8b665604-0 FeeSelector__FocusedOutlineCard-sc-2b537477-0 hJYFVB jlQAxw jgrgoQ">
													<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
														<div
															id="add-liquidity-selected-fee"
															className="Column__AutoColumn-sc-72c388fb-2 gXqkQO"
														>
															<div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1lohbqv">
																0.3% fee tier
															</div>
															<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
																The % you will earn in fees.
															</div>
														</div>
														<button
															width="auto"
															className="sc-bczRLJ cBKomN Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 ixVlAp jAJJVP"
															onClick={handleButtonHide}
														>
															{hideButton ? 'Hide' : 'Edit'}
														</button>
													</div>
												</div>
												{hideButton && (
													<div className="FeeSelector__Select-sc-2b537477-1 dpNkPS">
														<button className="sc-bczRLJ lbXqUa Button__BaseButton-sc-4f96dcd8-1 Button__ButtonOutlined-sc-4f96dcd8-7 eOoGds aQTri">
															<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
																<div className="Column__AutoColumn-sc-72c388fb-2 ezHOjM">
																	<div className="Column__AutoColumn-sc-72c388fb-2 gajsee">
																		<div className="text__TextWrapper-sc-9327e48a-0 blhgKn FeeOption__ResponsiveText-sc-6b7ccec1-0 fYKQxG css-1lohbqv">
																			0.01%
																		</div>
																		<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
																			Best for very stable pairs.
																		</div>
																	</div>
																</div>
															</div>
														</button>
														<button className="sc-bczRLJ lbXqUa Button__BaseButton-sc-4f96dcd8-1 Button__ButtonOutlined-sc-4f96dcd8-7 eOoGds aQTri">
															<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
																<div className="Column__AutoColumn-sc-72c388fb-2 ezHOjM">
																	<div className="Column__AutoColumn-sc-72c388fb-2 gajsee">
																		<div className="text__TextWrapper-sc-9327e48a-0 blhgKn FeeOption__ResponsiveText-sc-6b7ccec1-0 fYKQxG css-1lohbqv">
																			0.05%
																		</div>
																		<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
																			Best for stable pairs.
																		</div>
																	</div>
																</div>
															</div>
														</button>
														<button className="sc-bczRLJ lbXqUa Button__BaseButton-sc-4f96dcd8-1 Button__ButtonOutlined-sc-4f96dcd8-7 eOoGds aQTri">
															<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
																<div className="Column__AutoColumn-sc-72c388fb-2 ezHOjM">
																	<div className="Column__AutoColumn-sc-72c388fb-2 gajsee">
																		<div className="text__TextWrapper-sc-9327e48a-0 blhgKn FeeOption__ResponsiveText-sc-6b7ccec1-0 fYKQxG css-1lohbqv">
																			0.3%
																		</div>
																		<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
																			Best for most pairs.
																		</div>
																	</div>
																</div>
															</div>
														</button>
														<button className="sc-bczRLJ lbXqUa Button__BaseButton-sc-4f96dcd8-1 Button__ButtonOutlined-sc-4f96dcd8-7 eOoGds aQTri">
															<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
																<div className="Column__AutoColumn-sc-72c388fb-2 ezHOjM">
																	<div className="Column__AutoColumn-sc-72c388fb-2 gajsee">
																		<div className="text__TextWrapper-sc-9327e48a-0 blhgKn FeeOption__ResponsiveText-sc-6b7ccec1-0 fYKQxG css-1lohbqv">
																			1%
																		</div>
																		<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
																			Best for exotic pairs.
																		</div>
																	</div>
																</div>
															</div>
														</button>
													</div>
												)}
											</div>
										</div>
									</div>{' '}
								</div>
								<div
									disabled=""
									className={`Column__AutoColumn-sc-72c388fb-2 styled__DynamicSection-sc-a3e32a7b-2 erfjwt isLiqudity ${
										isLiquidityTokenSelected ? 'token-selected' : ''
									} `}
								>
									minInputValue
									<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
										<div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1lohbqv">
											Set Price Range
										</div>
									</div>
									<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__AutoRow-sc-34df4f97-3 hJYFVB bObhWT bEIXES">
										<div className="sc-bczRLJ Card-sc-8b665604-0 Card__OutlineCard-sc-8b665604-5 InputStepCounter__FocusedOutlineCard-sc-98d37844-2 hJYFVB jlQAxw hapmMj hXXOVF">
											<div className="InputStepCounter__InputRow-sc-98d37844-0 ddcmlg">
												<div className="Column__AutoColumn-sc-72c388fb-2 InputStepCounter__InputColumn-sc-98d37844-4 iHjCXw cVcAns">
													<div className="text__TextWrapper-sc-9327e48a-0 iJbhaU InputStepCounter__InputTitle-sc-98d37844-5 eRovVv css-9bv76i">
														Low price
													</div>
													<input
														className="NumericalInput__StyledInput-sc-e2342ddc-0 gZlbTK InputStepCounter__StyledInput-sc-98d37844-3 jgKZAt rate-input-0"
														fontSize="20px"
														inputMode="decimal"
														autoComplete="off"
														autoCorrect="off"
														type="text"
														pattern="^[0-9]*[.,]?[0-9]*$"
														placeholder={0}
														minLength={1}
														maxLength={79}
														spellCheck="false"
														value={minInputValue}
													/>
													<div className="text__TextWrapper-sc-9327e48a-0 iJbhaU InputStepCounter__InputTitle-sc-98d37844-5 eRovVv css-2qpl5c">
														per ETH
													</div>
												</div>
												<div className="Column__AutoColumn-sc-72c388fb-2 dCQVZu">
													<button
														data-testid="increment-price-range"
														disabled=""
														className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 InputStepCounter__SmallButton-sc-98d37844-1 hWKjgZ bdLEKg eKOJak"
													>
														<div
															disabled=""
															className="text__TextWrapper-sc-9327e48a-0 blhgKn InputStepCounter__ButtonLabel-sc-98d37844-6 ojMTq css-15li2d9"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width={18}
																height={18}
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<line x1={12} y1={5} x2={12} y2={19} />
																<line x1={5} y1={12} x2={19} y2={12} />
															</svg>
														</div>
													</button>
													<button
														data-testid="decrement-price-range"
														disabled=""
														className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 InputStepCounter__SmallButton-sc-98d37844-1 hWKjgZ bdLEKg eKOJak"
													>
														<div
															disabled=""
															className="text__TextWrapper-sc-9327e48a-0 blhgKn InputStepCounter__ButtonLabel-sc-98d37844-6 ojMTq css-15li2d9"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width={18}
																height={18}
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<line x1={5} y1={12} x2={19} y2={12} />
															</svg>
														</div>
													</button>
												</div>
											</div>
										</div>
										<div className="sc-bczRLJ Card-sc-8b665604-0 Card__OutlineCard-sc-8b665604-5 InputStepCounter__FocusedOutlineCard-sc-98d37844-2 hJYFVB jlQAxw hapmMj hXXOVF">
											<div className="InputStepCounter__InputRow-sc-98d37844-0 ddcmlg">
												<div className="Column__AutoColumn-sc-72c388fb-2 InputStepCounter__InputColumn-sc-98d37844-4 iHjCXw cVcAns">
													<div className="text__TextWrapper-sc-9327e48a-0 iJbhaU InputStepCounter__InputTitle-sc-98d37844-5 eRovVv css-9bv76i">
														High price
													</div>
													<input
														className="NumericalInput__StyledInput-sc-e2342ddc-0 gZlbTK InputStepCounter__StyledInput-sc-98d37844-3 jgKZAt rate-input-0"
														fontSize="20px"
														inputMode="decimal"
														autoComplete="off"
														autoCorrect="off"
														type="text"
														pattern="^[0-9]*[.,]?[0-9]*$"
														placeholder={0}
														minLength={1}
														maxLength={79}
														spellCheck="false"
														value={maxInputValue}
													/>
													<div className="text__TextWrapper-sc-9327e48a-0 iJbhaU InputStepCounter__InputTitle-sc-98d37844-5 eRovVv css-2qpl5c">
														per ETH
													</div>
												</div>
												<div className="Column__AutoColumn-sc-72c388fb-2 dCQVZu">
													<button
														data-testid="increment-price-range"
														disabled=""
														className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 InputStepCounter__SmallButton-sc-98d37844-1 hWKjgZ bdLEKg eKOJak"
													>
														<div
															disabled=""
															className="text__TextWrapper-sc-9327e48a-0 blhgKn InputStepCounter__ButtonLabel-sc-98d37844-6 ojMTq css-15li2d9"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width={18}
																height={18}
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<line x1={12} y1={5} x2={12} y2={19} />
																<line x1={5} y1={12} x2={19} y2={12} />
															</svg>
														</div>
													</button>
													<button
														data-testid="decrement-price-range"
														disabled=""
														className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 InputStepCounter__SmallButton-sc-98d37844-1 hWKjgZ bdLEKg eKOJak"
													>
														<div
															disabled=""
															className="text__TextWrapper-sc-9327e48a-0 blhgKn InputStepCounter__ButtonLabel-sc-98d37844-6 ojMTq css-15li2d9"
														>
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width={18}
																height={18}
																viewBox="0 0 24 24"
																fill="none"
																stroke="currentColor"
																strokeWidth={2}
																strokeLinecap="round"
																strokeLinejoin="round"
															>
																<line x1={5} y1={12} x2={19} y2={12} />
															</svg>
														</div>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									disabled=""
									className={`Column__AutoColumn-sc-72c388fb-2 styled__DynamicSection-sc-a3e32a7b-2 erfjwt isLiqudity ${
										isLiquidityTokenSelected ? 'token-selected' : ''
									}`}
								>
									{/* CHART */}
									<div
										className="Column__AutoColumn-sc-72c388fb-2 erfjwt"
										style={{ minHeight: 200 }}
									>
										<BarChart />
										<div className="LiquidityChartRangeInput__ChartWrapper-sc-4b8a30c6-0 AKZXT"></div>
									</div>
								</div>
								<div>
									<div
										disabled=""
										className={`Column__AutoColumn-sc-72c388fb-2 styled__DynamicSection-sc-a3e32a7b-2 gXqkQO isLiqudity ${
											isLiquidityTokenSelected ? 'token-selected' : ''
										}`}
									>
										<div className="Column__AutoColumn-sc-72c388fb-2 erfjwt">
											<div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1lohbqv">
												Deposit Amounts
											</div>
											<div
												id="add-liquidity-input-tokena"
												className="CurrencyInputPanel__InputPanel-sc-73f91aaf-0 fdQVur"
											>
												<div className="CurrencyInputPanel__Container-sc-73f91aaf-1 cOqmuC">
													<div className="CurrencyInputPanel__InputRow-sc-73f91aaf-3 hyQXvD">
														<input
															className="NumericalInput__StyledInput-sc-e2342ddc-0 hmakIi CurrencyInputPanel__StyledNumericalInput-sc-73f91aaf-10 byCAPU token-amount-input"
															inputMode="decimal"
															autoComplete="off"
															autoCorrect="off"
															type="text"
															pattern="^[0-9]*[.,]?[0-9]*$"
															placeholder={0}
															minLength={1}
															maxLength={79}
															spellCheck="false"
															defaultValue=""
														/>
														<button
															className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 CurrencyInputPanel__CurrencySelect-sc-73f91aaf-2 hWKjgZ jAJJVP cCMOgz open-currency-select-button"
															pointerEvents="none"
														>
															<span className="CurrencyInputPanel__Aligner-sc-73f91aaf-6 kkiXeD">
																<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 hJYFVB gOYHMo jeYuAz">
																	<div
																		className="AssetLogo__LogoContainer-sc-1d2e0d12-3 hOvXWG"
																		style={{
																			height: 24,
																			width: 24,
																			marginRight: '0.5rem',
																		}}
																	>
																		<div className="AssetLogo__LogoImageWrapper-sc-1d2e0d12-2 iZhrtN">
																			<img
																				src="/assets/images/tokens/eth-icon.png"
																				alt="ETH logo"
																				className="AssetLogo__LogoImage-sc-1d2e0d12-1 IJysW"
																			/>
																		</div>
																	</div>
																	<span className="CurrencyInputPanel__StyledTokenName-sc-73f91aaf-8 reOdD token-symbol-container">
																		ETH
																	</span>
																</div>
															</span>
														</button>
													</div>
													<div className="CurrencyInputPanel__LabelRow-sc-73f91aaf-4 CurrencyInputPanel__FiatRow-sc-73f91aaf-5 gRWQqi kjAAwT">
														<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
															<div className="styled__LoadingOpacityContainer-sc-f9cbe2c6-1 bmCdZH">
																<div className="sc-bczRLJ Row-sc-34df4f97-0 hJYFVB cPkaXY">
																	<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-zhpkf8">
																		<div className="Popover__ReferenceElement-sc-f19d15a-1 bndAvc">
																			<div>-</div>
																		</div>
																	</div>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div
												id="add-liquidity-input-tokenb"
												className="CurrencyInputPanel__InputPanel-sc-73f91aaf-0 fdQVur"
											>
												<div className="CurrencyInputPanel__Container-sc-73f91aaf-1 cOqmuC">
													<div className="CurrencyInputPanel__InputRow-sc-73f91aaf-3 hyQXvD">
														<input
															className="NumericalInput__StyledInput-sc-e2342ddc-0 hmakIi CurrencyInputPanel__StyledNumericalInput-sc-73f91aaf-10 byCAPU token-amount-input"
															inputMode="decimal"
															autoComplete="off"
															autoCorrect="off"
															type="text"
															pattern="^[0-9]*[.,]?[0-9]*$"
															placeholder={0}
															minLength={1}
															maxLength={79}
															spellCheck="false"
															defaultValue=""
														/>
														<button
															className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 CurrencyInputPanel__CurrencySelect-sc-73f91aaf-2 hWKjgZ jAJJVP gHpyEg open-currency-select-button"
															pointerEvents="none"
														>
															<span className="CurrencyInputPanel__Aligner-sc-73f91aaf-6 kkiXeD">
																<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 hJYFVB gOYHMo jeYuAz">
																	<span className="CurrencyInputPanel__StyledTokenName-sc-73f91aaf-8 reOdD token-symbol-container">
																		Select a token
																	</span>
																</div>
															</span>
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<button className="sc-bczRLJ gIjoKy Button__BaseButton-sc-4f96dcd8-1 Button__BaseButtonLight-sc-4f96dcd8-4 dkaNOU fCkFnu">
									<div className="Button__ButtonOverlay-sc-4f96dcd8-0 fNUVbK" />
									Connect Wallet
								</button>
							</div>
						</div>
					</main>
				</div>

				<SwapModal
					swapTokens={swapTokens}
					// selectedToken={selectedToken}
					selectedToken={
						currentCurrencyId === 'liquidityEthId' ? liquidityTokenOne : liquidityTokenTwo
					}
					swapModal={swapModal}
					setSwapModal={setSwapModal}
					isLiquidity={true}
					handleSelect={handleSelect}
					currentCurrencyId={currentCurrencyId}
					setCurrentCurrencyId={setCurrentCurrencyId}
					liquidityTokenOne={liquidityTokenOne}
					liquidityTokenTwo={liquidityTokenTwo}
				/>
			</div>
		</div>
	);
};

export default LiquidityModal;
