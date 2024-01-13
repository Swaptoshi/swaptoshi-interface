import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as cryptography from '@liskhq/lisk-cryptography';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import Avatar from '../Avatar/index';
import { addressCompact } from '../../utils/address';
import { useChain } from '../../context/ChainProvider';
import Loader from '../Loader/Loader';
import { getSwaptoshiIcon } from '../../service/icon';
import PrimaryButton from '../Button/PrimaryButton';
import { useWalletModal } from '../../context/WalletModalProvider';
import Dropdown from './Dropdown';
import { useDebouncedCallback } from 'use-debounce';
import { tryToast } from '../../utils/toast/tryToast';
import { intervalToSecond } from '../../utils/time/intervalToSecond';
import { getDEXToken } from '../../service/dex';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import TokenAvatar from '../Avatar/token';
import * as env from '../../utils/config/env';

const Navbar = () => {
	const location = useLocation();
	const logoImage = '/assets/images/logo/swaptoshi-logo.svg';

	const [isActiveHeader, setIsActiveHeader] = useState(false);
	const [initialResult, setInitialResult] = useState();
	const [searchResult, setSearchResult] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [isSearchOpen, setSearchOpen] = useState(false);
	const [isDropdownVisible, setDropdownVisibility] = useState(false);

	const { connect, wcUri, signClient, senderPublicKey } = useWalletConnect();
	const { availableService, selectedService, setChain } = useChain();
	const [isModalOpen, setIsModalOpen] = useWalletModal();
	const { fiatFormatter } = useLiskPrice();

	const centerSearchRef = useRef(null);
	const rightSearchRef = useRef(null);
	const rightSearchInsideRef = useRef(null);

	const onConnectFailed = React.useCallback(() => {
		setIsModalOpen(false);
	}, [setIsModalOpen]);

	const handleOpenModal = React.useCallback(() => {
		setIsModalOpen(true);
	}, [setIsModalOpen]);

	const connectHandler = React.useCallback(() => {
		handleOpenModal();
		if (!wcUri) connect({ onFailed: onConnectFailed });
	}, [handleOpenModal, wcUri, connect, onConnectFailed]);

	//For header
	useEffect(() => {
		function handleScroll() {
			if (window.pageYOffset > 50) {
				setIsActiveHeader(true);
			} else {
				setIsActiveHeader(false);
			}
		}
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const [selectedOption, setSelectedOption] = useState();
	const [optionsLabel, setOptionsLabel] = useState([]);

	React.useEffect(() => {
		if (selectedService) {
			setSelectedOption({
				value: selectedService.chainID,
				label: selectedService.networkType,
				imgSrc: getSwaptoshiIcon(selectedService.networkType),
			});
		}
	}, [selectedService]);

	React.useEffect(() => {
		if (!availableService) return;
		setOptionsLabel(
			availableService
				.map(service => ({
					value: service.chainID,
					label: service.networkType,
					imgSrc: getSwaptoshiIcon(service.networkType),
				}))
				.sort((a, b) => a.value - b.value),
		);
	}, [availableService]);

	const handleOptionClick = option => {
		setChain(option.value.substring(0, 2));
		setSelectedOption(option);
	};

	const searchToken = useDebouncedCallback(async search => {
		await tryToast(
			'Fetch token list failed',
			async () => {
				const param = {
					offset: 0,
					limit: 3,
					changeWindow: env.TOKENS_LIST_DEFAULT_WINDOW,
					start: Math.floor(Date.now() / 1000) - intervalToSecond[env.TOKENS_LIST_DEFAULT_WINDOW],
					end: Math.floor(Date.now() / 1000),
				};
				if (search) param.search = search;
				const tokens = await getDEXToken(
					param,
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (tokens && tokens.data) {
					if (!search) setInitialResult(tokens.data);
					setSearchResult(tokens.data);
				}
				setIsLoading(false);
			},
			() => setIsLoading(false),
		);
	}, 500);

	const handleSearchChange = React.useCallback(
		e => {
			setSearchOpen(true);
			setIsLoading(true);
			if (!e || e.target.value || !searchResult || (searchResult && searchResult.length === 0)) {
				searchToken(e ? e.target.value : undefined);
			} else {
				setSearchResult(initialResult);
				setIsLoading(false);
			}
		},
		[initialResult, searchResult, searchToken],
	);

	const handleSearchClick = React.useCallback(() => {
		setSearchOpen(true);
		if (!searchResult || (searchResult && searchResult.length === 0)) {
			setIsLoading(true);
			searchToken();
		}
	}, [searchResult, searchToken]);

	useEffect(() => {
		if (!isSearchOpen && !isDropdownVisible) return; // If both dropdowns are closed, no need for the listener

		const handleClickOutside = event => {
			if (centerSearchRef.current && !centerSearchRef.current.contains(event.target)) {
				setSearchOpen(false);
			}

			if (
				rightSearchRef.current &&
				!rightSearchRef.current.contains(event.target) &&
				(!rightSearchInsideRef.current || !rightSearchInsideRef.current.contains(event.target))
			) {
				setDropdownVisibility(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isSearchOpen, isDropdownVisible, centerSearchRef, rightSearchRef, rightSearchInsideRef]);

	function determineTrendIcon(priceChangeUSD) {
		if (priceChangeUSD > 0) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		} else if (priceChangeUSD < 0) {
			return (
				<i
					style={{ color: 'rgb(252, 83, 83)' }}
					className="trends-down-icon ri-arrow-right-down-line"
				></i>
			);
		} else if (priceChangeUSD === 0) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		}
		return null;
	}

	return (
		<React.Fragment>
			<div className={`sc-1dv6j2d-2 hirdVF ${isActiveHeader ? 'sticky' : ''}`}>
				<header id="header" className="header">
					<nav className="nav ">
						{/* left____Nav */}
						<div className="left-nav">
							<NavLink className="logo-wrap" to="/">
								<img className="logo-image" src={logoImage} alt="swaptoshi" />
								<div
									style={{
										position: 'absolute',
										height: '40px',
										width: '40px',
										left: '22px',
										backgroundColor: 'white',
										filter: 'blur(16px)',
										opacity: 0.4,
										zIndex: -2,
									}}
								/>
							</NavLink>
							<div className="show-below-768 hide-above-768">
								{optionsLabel === undefined ? (
									<Loader size={12} />
								) : optionsLabel.length > 0 && selectedOption ? (
									<Dropdown
										className={'chain-selector'}
										selectedOption={selectedOption}
										optionsLabel={optionsLabel}
										handleOptionClick={handleOptionClick}
									/>
								) : (
									<span className="text">No Networks</span>
								)}
							</div>
							<div className="nav-menu" id="nav-menu">
								<ul className="list-unstyled nav-list elYyfH">
									<li
										className="nav-item hover-shadow"
										style={{
											backgroundColor:
												location.pathname === '/swap' ? 'var(--hover-background)' : undefined,
										}}
									>
										<NavLink className="nav-link" to="/swap">
											Swap
										</NavLink>
									</li>
									<li
										className="nav-item hover-shadow"
										style={{
											backgroundColor:
												location.pathname === '/tokens' ? 'var(--hover-background)' : undefined,
										}}
									>
										<NavLink className="nav-link" to="/tokens">
											Tokens
										</NavLink>
									</li>
									<li
										className="nav-item hover-shadow"
										style={{
											backgroundColor:
												location.pathname === '/pools' ? 'var(--hover-background)' : undefined,
										}}
									>
										<NavLink className="nav-link" to="/pools">
											Pools
										</NavLink>
									</li>
								</ul>
							</div>
						</div>

						{/*center____Nav */}
						<div className="center-nav">
							<div className="custom-search-dropdown" ref={centerSearchRef}>
								<div className="custom-search-inside inside-search">
									<i className="search-icon ri-search-line text"></i>

									<input
										className=""
										type="search"
										placeholder="Search tokens"
										onChange={handleSearchChange}
										onClick={handleSearchClick}
									/>
									<div className="slash" style={{ display: isSearchOpen ? 'none' : 'block' }}>
										/
									</div>
								</div>

								{isSearchOpen && (
									<ul className="search-options-box">
										<div className="options-box">
											<div className="so">
												<div className="">
													{isLoading ? (
														<div
															style={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '100%',
																margin: '64px 0px',
															}}
														>
															<Loader size={30} />{' '}
														</div>
													) : searchResult && searchResult.length > 0 ? (
														searchResult.map(option => (
															<React.Fragment key={option.tokenId}>
																<React.Fragment>
																	<div className="popular-tokens-item">
																		<NavLink
																			to={`/tokens/${option.tokenId}`}
																			className="tokens-options"
																			onClick={() => {
																				setSearchOpen(false);
																			}}
																		>
																			<div className="left-item">
																				<div>
																					<div className="img-div">
																						<TokenAvatar
																							src={option.logo}
																							size={35}
																							tokenId={option.tokenId}
																						/>
																					</div>
																					<div className="dCJIvZ"></div>
																				</div>
																				<div className="token-name">
																					<div className="token-name-value">
																						<span>{option.tokenName}</span>
																					</div>
																					<div className="symbol">
																						{option.symbol && <span>{option.symbol}</span>}
																					</div>
																				</div>
																			</div>

																			<div className="right-item">
																				{/* data for Tokens */}
																				{option.priceUSD && (
																					<React.Fragment>
																						<div>
																							<div className="price-item">
																								<span className="price-text">
																									{fiatFormatter.format(option.priceUSD.toFixed(4))}
																								</span>
																							</div>
																						</div>
																						<div className="percentage">
																							<span>
																								{determineTrendIcon(option.priceChangeUSD)}
																							</span>
																							<span
																								className="percentage-text"
																								style={{
																									color:
																										option.priceChangeUSD > 0
																											? 'rgb(118, 209, 145)'
																											: 'rgb(252, 83, 83)',
																								}}
																							>
																								<span>{option.priceChangeUSD.toFixed(2)}%</span>
																							</span>
																						</div>
																					</React.Fragment>
																				)}
																			</div>
																		</NavLink>
																	</div>
																</React.Fragment>
															</React.Fragment>
														))
													) : (
														<div
															style={{
																display: 'flex',
																justifyContent: 'center',
																alignItems: 'center',
																width: '100%',
																margin: '64px 0px',
																color: 'var(--color-white)',
															}}
														>
															Nothing to show
														</div>
													)}
												</div>
											</div>
										</div>
									</ul>
								)}
							</div>
						</div>

						{/* right____Nav */}
						<div className="right-nav">
							<div className="right-nav-wrapper">
								<div className="search-mobile">
									{isDropdownVisible && (
										<div className="custom-search-dropdown" ref={rightSearchRef}>
											<div
												className="custom-search-inside inside-search"
												ref={rightSearchInsideRef}
											>
												<i className="search-icon ri-search-line text"></i>

												<input
													className=""
													type="search"
													placeholder="Search tokens"
													onChange={handleSearchChange}
													onClick={handleSearchClick}
												/>
												<div className="slash" style={{ display: isSearchOpen ? 'none' : 'block' }}>
													/
												</div>

												{isSearchOpen && (
													<ul className="search-options-box">
														<div className="options-box">
															<div className="so">
																<div className="">
																	{isLoading ? (
																		<div
																			style={{
																				display: 'flex',
																				justifyContent: 'center',
																				alignItems: 'center',
																				width: '100%',
																				margin: '64px 0px',
																			}}
																		>
																			<Loader size={30} />{' '}
																		</div>
																	) : searchResult && searchResult.length > 0 ? (
																		searchResult.map(option => (
																			<React.Fragment key={option.tokenId}>
																				<React.Fragment>
																					<div className="popular-tokens-item">
																						<NavLink
																							to={`/tokens/${option.tokenId}`}
																							className="tokens-options"
																							onClick={() => {
																								setSearchOpen(false);
																							}}
																						>
																							<div className="left-item">
																								<div>
																									<div className="img-div">
																										<TokenAvatar
																											src={option.logo}
																											size={35}
																											tokenId={option.tokenId}
																										/>
																									</div>
																									<div className="dCJIvZ"></div>
																								</div>
																								<div className="token-name">
																									<div className="token-name-value">
																										<span>{option.tokenName}</span>
																									</div>
																									<div className="symbol">
																										{option.symbol && <span>{option.symbol}</span>}
																									</div>
																								</div>
																							</div>
																							<div className="right-item">
																								{/* data for Tokens */}
																								{option.priceUSD && (
																									<React.Fragment>
																										<div>
																											<div className="price-item">
																												<span className="price-text">
																													{fiatFormatter.format(
																														option.priceUSD.toFixed(4),
																													)}
																												</span>
																											</div>
																										</div>
																										<div className="percentage">
																											<span>
																												{determineTrendIcon(option.priceChangeUSD)}
																											</span>
																											<span
																												className="percentage-text"
																												style={{
																													color:
																														option.priceChangeUSD > 0
																															? 'rgb(118, 209, 145)'
																															: 'rgb(252, 83, 83)',
																												}}
																											>
																												<span>
																													{option.priceChangeUSD.toFixed(4)}%
																												</span>
																											</span>
																										</div>
																									</React.Fragment>
																								)}
																							</div>
																						</NavLink>
																					</div>
																				</React.Fragment>
																			</React.Fragment>
																		))
																	) : (
																		<div
																			style={{
																				display: 'flex',
																				justifyContent: 'center',
																				alignItems: 'center',
																				width: '100%',
																				margin: '64px 0px',
																				color: 'var(--color-white)',
																			}}
																		>
																			Nothing to show
																		</div>
																	)}
																</div>
															</div>
														</div>
													</ul>
												)}
											</div>
										</div>
									)}
									<button
										className="search-button"
										onClick={() => setDropdownVisibility(!isDropdownVisible)}
									>
										<i className="search-icon ri-search-line text"></i>
									</button>
								</div>

								<div className="hide-below-768">
									{optionsLabel === undefined ? (
										<Loader size={12} />
									) : optionsLabel.length > 0 && selectedOption ? (
										<Dropdown
											className={'chain-selector'}
											selectedOption={selectedOption}
											optionsLabel={optionsLabel}
											handleOptionClick={handleOptionClick}
										/>
									) : (
										<span className="text">No Networks</span>
									)}
								</div>

								{senderPublicKey ? (
									<button
										className="hover-shadow"
										onClick={handleOpenModal}
										disabled={senderPublicKey ? false : signClient === undefined}
										style={{
											opacity: (senderPublicKey ? false : signClient === undefined) ? 0.2 : 1,
											display: 'flex',
											alignItems: 'center',
											borderWidth: 0,
											height: '40px',
											padding: '4px',
											borderRadius: '16px',
										}}
									>
										<Avatar
											address={cryptography.address.getLisk32AddressFromPublicKey(
												Buffer.from(senderPublicKey, 'hex'),
											)}
											size={30}
										/>
										<p
											className="hide-below-1024"
											style={{
												marginTop: 'auto',
												marginBottom: 'auto',
												marginLeft: '8px',
											}}
										>
											{addressCompact(
												cryptography.address.getLisk32AddressFromPublicKey(
													Buffer.from(senderPublicKey, 'hex'),
												),
											)}
										</p>
									</button>
								) : (
									<PrimaryButton
										onClick={connectHandler}
										disabled={signClient === undefined}
										style={{ opacity: signClient === undefined ? 0.2 : 1 }}
									>
										Connect
									</PrimaryButton>
								)}
								<div style={{ width: '4px' }} />
							</div>
						</div>
					</nav>
				</header>
				<Modal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
			</div>

			{/* <Mobile Menu> */}

			<nav className="nav ">
				<ul className="mobile-nav ">
					<li className="nav-item">
						<NavLink className="nav-link" to="/swap">
							Swap
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="/tokens">
							Tokens
						</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="/pools">
							Pools
						</NavLink>
					</li>
				</ul>
			</nav>
		</React.Fragment>
	);
};

export default Navbar;
