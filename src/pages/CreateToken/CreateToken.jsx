import React from 'react';
import './CreateToken.css';
import { NavLink } from 'react-router-dom';
import TextInput from '../../components/Forms/TextInput';
import SecondaryButton from '../../components/Button/SecondaryButton';
import { FileUploader } from 'react-drag-drop-files';
import { useTheme } from '../../context/ThemeProvider';
import { getSystemTheme } from '../../utils/Theme/getSystemTheme';
import { toast } from 'react-toastify';
import WalletActionButton from '../../components/Button/WalletActionButton';

const CreateTokenModal = () => {
	const [theme] = useTheme();
	const [, setCurrentTheme] = React.useState(theme);
	const [showAdvanced, setShowAdvanced] = React.useState(false);
	const [error, setError] = React.useState('');

	const [tokenName, setTokenName] = React.useState('');
	const [tokenSymbol, setTokenSymbol] = React.useState('');
	const [amount, setAmount] = React.useState('');
	const [description, setDescription] = React.useState('Token created by Swaptoshi Chain');
	const [baseDenom, setBaseDenom] = React.useState('unit');
	const [decimal, setDecimal] = React.useState('8');
	const [logo, setLogo] = React.useState();

	const handleTokenName = event => setTokenName(event.target.value);
	const handleTokenSymbol = event => setTokenSymbol(event.target.value);
	const handleAmount = event => setAmount(event.target.value);
	const handleDescription = event => setDescription(event.target.value);
	const handleDenomination = event => setBaseDenom(event.target.value);
	const handleDecimal = event => setDecimal(event.target.value);

	React.useEffect(() => {
		theme === 'system' ? setCurrentTheme(getSystemTheme()) : setCurrentTheme(theme);
	}, [setCurrentTheme, theme]);

	const toogleShowAdvanced = React.useCallback(() => {
		if (showAdvanced) setShowAdvanced(false);
		else setShowAdvanced(true);
	}, [showAdvanced]);

	function handleFileError(e) {
		setError(e);
	}

	function handleChange(e) {
		setLogo(URL.createObjectURL(e));
		setError();
	}

	function onFileDelete() {
		setLogo();
		setError();
	}

	const handleSubmit = React.useCallback(
		e => {
			e.preventDefault();
			console.log(tokenName, tokenSymbol, amount, description, baseDenom, decimal, logo);
			toast('🦄 Wow so easy!', {
				progress: undefined,
				theme: 'dark',
			});
		},
		[tokenName, tokenSymbol, amount, description, baseDenom, decimal, logo],
	);

	return (
		<div>
			<div className="App__BodyWrapper-sc-7e45ae4f-0 clIMsa">
				<div className="styled__ScrollablePage-sc-a3e32a7b-1 kVNjZg">
					<main
						className={`AppBody_BodyWrapper-sc-19e20e47-0 AddLiquidity_StyledBodyWrapper-sc-91848848-0 GfTH FuZnx-expanded`}
					>
						<div className="NavigationTabs__Tabs-sc-b4540a6e-0 kmmojd">
							<div
								className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr"
								style={{ padding: '1rem 1rem 0px' }}
							>
								<NavLink
									flex={1}
									className="NavigationTabs__StyledLink-sc-b4540a6e-1 dIAqzj"
									to="/tokens"
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
									Create Token
								</div>
								<div className="css-vurnku" style={{ marginRight: '0.5rem' }}>
									<div
										className="sc-bczRLJ Row-sc-34df4f97-0 fgCeff gOYHMo"
										style={{ width: 'fit-content', minWidth: 'fit-content' }}
									>
										<div className="styled__MediumOnly-sc-a3e32a7b-6 cYrhOe">
											<button
												onClick={toogleShowAdvanced}
												className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonText-sc-4f96dcd8-9 hWKjgZ jtnClT"
											>
												<div className="text__TextWrapper-sc-9327e48a-0 cWDToC css-15li2d9">
													{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
												</div>
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit}>
							<div className="styled__Wrapper-sc-a3e32a7b-0 vSeCC">
								<div className="styled__ResponsiveTwoColumns-sc-a3e32a7b-5 dXokMm">
									<div className="Column__AutoColumn-sc-72c388fb-2 ereGUg">
										<div className="Column__AutoColumn-sc-72c388fb-2 erfjwt">
											<div
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													width: '100%',
												}}
											>
												{logo ? (
													<div
														style={{
															width: '120px',
															height: '200px',
															margin: 'auto',
															padding: '8px',
															display: 'flex',
															flexDirection: 'column',
															justifyContent: 'center',
														}}
													>
														<img
															src={logo}
															style={{
																width: '100px',
																height: '100px',
																borderRadius: '100%',
																overflow: 'hidden',
																objectFit: 'cover',
																margin: 'auto',
															}}
															alt="coin"
														/>
														<SecondaryButton
															onClick={onFileDelete}
															style={{ margin: 'auto', marginTop: '8px' }}
														>
															delete
														</SecondaryButton>
													</div>
												) : (
													<FileUploader
														multiple={false}
														required
														types={['jpg', 'png', 'svg']}
														onTypeError={handleFileError}
														maxSize={0.064}
														onSizeError={handleFileError}
														handleChange={handleChange}
														classes="custom-file-upload"
													>
														<div>
															<div style={{ width: '80px', margin: 'auto' }}>
																<svg
																	viewBox="0 0 24 24"
																	fill="none"
																	xmlns="http://www.w3.org/2000/svg"
																>
																	<path
																		d="M12 17L12 10M12 10L15 13M12 10L9 13"
																		stroke="#808080"
																		strokeWidth="1.5"
																		strokeLinecap="round"
																		strokeLinejoin="round"
																	/>
																	<path
																		d="M16 7H12H8"
																		stroke="#808080"
																		strokeWidth="1.5"
																		strokeLinecap="round"
																	/>
																	<path
																		d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
																		stroke="#808080"
																		strokeWidth="1.5"
																		strokeLinecap="round"
																	/>
																</svg>
															</div>
															<div
																style={{
																	textAlign: 'center',
																	marginTop: '8px',
																	color: '#808080',
																}}
															>
																select or drop token icon here
																<br />
																(.jpg, .png, .svg, Max 2MB)
																{error && <div style={{ color: 'red' }}>{error}</div>}
															</div>
														</div>
													</FileUploader>
												)}
											</div>

											<TextInput
												fontSize="20px"
												type="text"
												placeholder={'Token Name'}
												onChange={handleTokenName}
												value={tokenName}
											/>

											<TextInput
												style={{
													textTransform: tokenSymbol.length > 0 ? 'uppercase' : undefined,
												}}
												fontSize="20px"
												type="text"
												pattern="^[a-zA-Z0-9]+$"
												minLength={1}
												maxLength={20}
												placeholder={'Token Symbol'}
												onChange={handleTokenSymbol}
												value={tokenSymbol}
											/>

											<TextInput
												className="no-arrow"
												fontSize="20px"
												type="number"
												pattern="^[0-9]+$"
												placeholder={'Supply'}
												onChange={handleAmount}
												value={amount}
											/>

											{showAdvanced && (
												<>
													<TextInput
														fontSize="20px"
														type="text"
														placeholder={'Description'}
														onChange={handleDescription}
														value={description}
													/>
													<TextInput
														fontSize="20px"
														type="text"
														placeholder={'Denomination'}
														onChange={handleDenomination}
														value={baseDenom}
													/>
													<TextInput
														className="no-arrow"
														fontSize="20px"
														type="number"
														placeholder={'Decimal'}
														onChange={handleDecimal}
														value={decimal}
													/>
												</>
											)}
										</div>
									</div>
									<WalletActionButton type="submit" style={{ height: '60px' }}>
										Create Token
									</WalletActionButton>
								</div>
							</div>
						</form>
					</main>
				</div>
			</div>
		</div>
	);
};

export default CreateTokenModal;
