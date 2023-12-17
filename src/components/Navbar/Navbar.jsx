import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as cryptography from '@liskhq/lisk-cryptography';
import './Navbar.css';
import { NavLink } from 'react-router-dom';
import Modal from '../Modal/Modal';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import Avatar from '../Avatar/index';
import { addressCompact } from '../../utils/Address';
import { useChain } from '../../context/ChainProvider';
import Loader from '../Loader/Loader';
import { getSwaptoshiIcon } from '../../service/icon';
import PrimaryButton from '../Button/PrimaryButton';
import { useWalletModal } from '../../context/WalletModalProvider';
import Dropdown from './Dropdown';

const Navbar = ({ searchOptions }) => {
	const location = useLocation();
	const logoImage = '/assets/images/logo/swaptoshi-logo.svg';
	const [isActiveHeader, setIsActiveHeader] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [isSearchOpen, setSearchOpen] = useState(false);
	const [isDropdownVisible, setDropdownVisibility] = useState(false);

	const { connect, wcUri, signClient, senderPublicKey } = useWalletConnect();
	const { availableService, selectedService, setChain } = useChain();
	const [isModalOpen, setIsModalOpen] = useWalletModal();

	const centerSearchRef = useRef(null);
	const rightSearchRef = useRef(null);
	const rightSearchInsideRef = useRef(null);

	const onConnectFailed = React.useCallback(() => {
		setIsModalOpen(false);
	}, [setIsModalOpen]);

	const handleOpenModal = React.useCallback(() => {
		setIsOpen(false);
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

	const [isOpen, setIsOpen] = useState(false);

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

	const toggleDropdown = React.useCallback(() => setIsOpen(!isOpen), [isOpen]);

	const handleOptionClick = option => {
		setChain(option.value.substring(0, 2));
		setSelectedOption(option);
		setIsOpen(false);
	};

	const handleSearchChange = e => {
		setSearchTerm(e.target.value);
	};

	const filteredOptions = searchOptions.filter(option =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

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

	function determineTrendIcon(current, old) {
		if (current > old) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		} else if (current < old) {
			return (
				<i
					style={{ color: 'rgb(252, 83, 83)' }}
					className="trends-down-icon ri-arrow-right-down-line"
				></i>
			);
		} else if (current === old) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		}
		return null;
	}

	//Calculate Search `dropdown` rates
	function calculatePercentChange(current, old) {
		return Math.abs(((current - old) / old) * 100);
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
										left: '30px',
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
										selectedOption={selectedOption}
										toggleDropdown={toggleDropdown}
										isOpen={isOpen}
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
									{/* <img className='search-icon' style={{ width: "20px" }} src='/images/search.svg' /> */}
									<i className="search-icon ri-search-line"></i>

									<input
										className=""
										type="search"
										placeholder="Search tokens and NFT collections"
										value={searchTerm}
										onChange={handleSearchChange}
										onClick={() => setSearchOpen(true)}
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
													{filteredOptions.map((option, index) => (
														<React.Fragment key={index}>
															{option.price && !filteredOptions[index - 1]?.price && (
																<div className="popular-tokens">
																	<div className="popular-title">
																		<img
																			className="rotate-arrow"
																			src="assets/images/trends-arrow.png"
																		/>

																		<div>Popular Tokens</div>
																	</div>
																</div>
															)}
															{/* title for popular NFTs */}
															{option.floor && !searchOptions[index - 1]?.floor && (
																<div className="popular-tokens">
																	<div className="popular-title">
																		<img
																			className="rotate-arrow"
																			src="assets/images/trends-arrow.png"
																		/>
																		<div>Popular NFTs</div>
																	</div>
																</div>
															)}
															<React.Fragment>
																<div className="popular-tokens-item">
																	<a
																		href="/tokens"
																		className="tokens-options"
																		onClick={() => {
																			handleOptionClick(option);
																			setSearchTerm(option.label);
																			setSearchOpen(false);
																		}}
																	>
																		<div className="left-item">
																			<div>
																				<div className="img-div">
																					<img src={option.imgSrc} alt={option.label} />
																				</div>
																				<div className="dCJIvZ"></div>
																			</div>
																			<div className="token-name">
																				<div className="token-name-value">
																					<span>{option.label}</span>
																				</div>
																				<div className="symbol">
																					{option.symbol && <span>{option.symbol}</span>}
																					<div className="">
																						{option.items && (
																							<span> {option.items.toLocaleString()} items</span>
																						)}
																					</div>
																				</div>
																			</div>
																		</div>
																		<div className="right-item">
																			{/* data for Tokens */}
																			{option.price && (
																				<React.Fragment>
																					<div>
																						<div className="price-item">
																							<span className="price-text">
																								${option.price.toFixed(2)}
																							</span>
																						</div>
																					</div>
																					<div className="percentage">
																						<span>
																							{determineTrendIcon(option.price, option.oldPrice)}
																						</span>
																						<span
																							className="percentage-text"
																							style={{
																								color:
																									option.price > option.oldPrice
																										? 'rgb(118, 209, 145)'
																										: 'rgb(252, 83, 83)',
																							}}
																						>
																							<span>
																								{calculatePercentChange(
																									option.price,
																									option.oldPrice,
																								).toFixed(2)}
																								%
																							</span>
																						</span>
																					</div>
																				</React.Fragment>
																			)}
																			{/* data for Floor */}
																			{option.floor && (
																				<React.Fragment>
																					<div className="floor-rate">
																						<span>{option.floor.toFixed(2)} ETH</span>
																					</div>
																					<span className="floor-text">
																						<p>Floor</p>
																					</span>
																				</React.Fragment>
																			)}
																		</div>
																	</a>
																</div>
															</React.Fragment>
														</React.Fragment>
													))}
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
												{/* <img className='search-icon' style={{ width: "20px" }} src='/images/search.svg' /> */}
												<i className="search-icon ri-search-line"></i>

												<input
													className=""
													type="search"
													placeholder="Search tokens and NFT collections"
													value={searchTerm}
													onChange={handleSearchChange}
													onClick={() => setSearchOpen(true)}
												/>
												<div className="slash" style={{ display: isSearchOpen ? 'none' : 'block' }}>
													/
												</div>

												{isSearchOpen && (
													<ul className="search-options-box">
														<div className="options-box">
															<div className="so">
																<div className="">
																	{filteredOptions.map((option, index) => (
																		<React.Fragment key={index}>
																			{option.price && !filteredOptions[index - 1]?.price && (
																				<div className="popular-tokens">
																					<div className="popular-title">
																						<img
																							className="rotate-arrow"
																							src="assets/images/trends-arrow.png"
																						/>

																						<div>Popular Tokens</div>
																					</div>
																				</div>
																			)}
																			{/* title for popular NFTs */}
																			{option.floor && !searchOptions[index - 1]?.floor && (
																				<div className="popular-tokens">
																					<div className="popular-title">
																						<img
																							className="rotate-arrow"
																							src="assets/images/trends-arrow.png"
																						/>
																						<div>Popular NFTs</div>
																					</div>
																				</div>
																			)}
																			<React.Fragment>
																				<div className="popular-tokens-item">
																					<a
																						href="/tokens"
																						className="tokens-options"
																						onClick={() => {
																							handleOptionClick(option);
																							setSearchTerm(option.label);
																							setSearchOpen(false);
																						}}
																					>
																						<div className="left-item">
																							<div>
																								<div className="img-div">
																									<img src={option.imgSrc} alt={option.label} />
																								</div>
																								<div className="dCJIvZ"></div>
																							</div>
																							<div className="token-name">
																								<div className="token-name-value">
																									<span>{option.label}</span>
																								</div>
																								<div className="symbol">
																									{option.symbol && <span>{option.symbol}</span>}
																									<div className="">
																										{option.items && (
																											<span>
																												{' '}
																												{option.items.toLocaleString()} items
																											</span>
																										)}
																									</div>
																								</div>
																							</div>
																						</div>
																						<div className="right-item">
																							{/* data for Tokens */}
																							{option.price && (
																								<React.Fragment>
																									<div>
																										<div className="price-item">
																											<span className="price-text">
																												${option.price.toFixed(2)}
																											</span>
																										</div>
																									</div>
																									<div className="percentage">
																										<span>
																											{determineTrendIcon(
																												option.price,
																												option.oldPrice,
																											)}
																										</span>
																										<span
																											className="percentage-text"
																											style={{
																												color:
																													option.price > option.oldPrice
																														? 'rgb(118, 209, 145)'
																														: 'rgb(252, 83, 83)',
																											}}
																										>
																											<span>
																												{calculatePercentChange(
																													option.price,
																													option.oldPrice,
																												).toFixed(2)}
																												%
																											</span>
																										</span>
																									</div>
																								</React.Fragment>
																							)}
																							{/* data for Floor */}
																							{option.floor && (
																								<React.Fragment>
																									<div className="floor-rate">
																										<span>{option.floor.toFixed(2)} ETH</span>
																									</div>
																									<span className="floor-text">
																										<p>Floor</p>
																									</span>
																								</React.Fragment>
																							)}
																						</div>
																					</a>
																				</div>
																			</React.Fragment>
																		</React.Fragment>
																	))}
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
										<i className="search-icon ri-search-line"></i>
									</button>
								</div>

								<div className="hide-below-768">
									{optionsLabel === undefined ? (
										<Loader size={12} />
									) : optionsLabel.length > 0 && selectedOption ? (
										<Dropdown
											selectedOption={selectedOption}
											toggleDropdown={toggleDropdown}
											isOpen={isOpen}
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
										disabled={signClient === undefined}
										style={{
											opacity: signClient === undefined ? 0.2 : 1,
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
