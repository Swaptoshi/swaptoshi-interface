import React, { useState, useEffect } from 'react';
import './Token.css';
import { Link, NavLink } from 'react-router-dom';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { timeframes } from '../../constants/timeframe';
import { tryToast } from '../../utils/Toast/tryToast';
import { getDEXToken } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import Loader from '../../components/Loader';
import { intervalToSecond } from '../../utils/Time/intervalToSecond';
import { useDebouncedCallback } from 'use-debounce';
import Dropdown from '../../components/Navbar/Dropdown';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import TokenAvatar from '../../components/Avatar/token';

const Token = () => {
	const { selectedService } = useChain();
	const { compactFiatFormatter } = useLiskPrice();

	const [isLoading, setIsLoading] = useState(true);
	const [sortBy, setSortBy] = useState('totalTvlUSD');
	const [sortOrder, setSortOrder] = useState('desc');

	const [selectedTimeframe, setSelectedTimeframe] = useState(
		timeframes.find(t => t.value === process.env.REACT_APP_TOKENS_LIST_DEFAULT_WINDOW),
	);
	const [tokens, setTokens] = useState();
	const [filteredTableData, setFilteredTableData] = useState();

	const fetchToken = useDebouncedCallback(async (changeWindow, search) => {
		await tryToast(
			'Fetch token list failed',
			async () => {
				const param = {
					offset: 0,
					limit: 100,
					changeWindow,
					start: Math.floor(Date.now() / 1000) - intervalToSecond[changeWindow],
					end: Math.floor(Date.now() / 1000),
					sortBy,
					sortOrder,
				};
				if (search) param.search = search;
				const tokens = await getDEXToken(
					param,
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (tokens && tokens.data) {
					if (!search) setTokens(tokens.data);
					setFilteredTableData(tokens.data);
				}
				setIsLoading(false);
			},
			() => setIsLoading(false),
		);
	}, 500);

	const filterToken = useDebouncedCallback(async search => {
		await fetchToken(selectedTimeframe.value, search);
	}, 500);

	const handleFilterToken = React.useCallback(
		e => {
			setIsLoading(true);
			if (e.target.value) {
				filterToken(e.target.value);
			} else {
				setFilteredTableData(tokens);
				setIsLoading(false);
			}
		},
		[filterToken, tokens],
	);

	const sortData = React.useCallback(
		async criteria => {
			setIsLoading(true);

			const newSortOrder = sortBy === criteria && sortOrder === 'asc' ? 'desc' : 'asc';
			setSortBy(criteria);
			setSortOrder(newSortOrder);

			await fetchToken(selectedTimeframe.value);
		},
		[fetchToken, selectedTimeframe, sortBy, sortOrder],
	);

	useEffect(() => {
		const run = async () => {
			setIsLoading(true);
			fetchToken(selectedTimeframe.value);
		};

		run();
	}, [fetchToken, selectedTimeframe]);

	const determineTrendIcon = React.useCallback(priceChange => {
		if (priceChange > 0) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		} else if (priceChange < 0) {
			return (
				<i
					style={{ color: 'rgb(252, 83, 83)' }}
					className="trends-down-icon ri-arrow-right-down-line"
				></i>
			);
		} else if (priceChange === 0) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		}
		return null;
	}, []);

	const handleTimeframeOptionClick = React.useCallback(option => {
		setSelectedTimeframe(option);
	}, []);

	return (
		<React.Fragment>
			<div className="token-wrapper">
				<div className="token-container">
					<div className="token-title-wrapper">
						<div className="token-title">
							<p>Top Tokens on Swaptoshi</p>
						</div>
					</div>

					<div className="filter-wrapper">
						<div className="filter-dropdowns">
							<div className="crypto-currency-drop">
								<div className="token-update">
									<Dropdown
										className={'timeframe-selector'}
										anchorClassName={'timeframe-selector-anchor'}
										selectedOption={selectedTimeframe}
										optionsLabel={timeframes}
										handleOptionClick={handleTimeframeOptionClick}
									/>
								</div>
							</div>
							<div
								style={{
									justifyContent: 'end',
									width: '100%',
									display: 'flex',
								}}
							>
								<NavLink
									className="hide-below-375 show-below-720 hide-above-720"
									to="/create-token"
								>
									<PrimaryButton style={{ width: '130px' }}>Create Token</PrimaryButton>
								</NavLink>

								<NavLink className="show-below-375 hide-above-375" to="/create-token">
									<PrimaryButton style={{ width: '60px' }}>+</PrimaryButton>
								</NavLink>
							</div>
						</div>
						<div id="tokenInputWrapper" className="token-input-wrapper">
							<div className="">
								<input
									data-cy="explore-tokens-search-input"
									type="search"
									placeholder="Filter tokens"
									id="searchBar"
									autoComplete="off"
									className="token-input"
									defaultValue=""
									onChange={handleFilterToken}
								/>
							</div>
						</div>

						<NavLink className="hide-below-720" to="/create-token">
							<PrimaryButton style={{ width: '200px' }}>Create Token</PrimaryButton>
						</NavLink>
					</div>

					{/* Data Head  */}
					<div className="sc-19z0ycm-0 frDKYg">
						<div
							data-testid="header-row"
							id="giptel"
							className="sc-1bit9h6-1 sc-1bit9h6-4 fTDqns  "
						>
							<div className="sc-1bit9h6-0 sc-1bit9h6-5 hJyIyF bwVaNf">#</div>
							<div data-testid="name-cell" className="sc-1bit9h6-0 sc-1bit9h6-8 hJyIyF fLXlBW">
								Token name
							</div>
							<div
								data-testid="price-cell"
								className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-9 hJyIyF knzTRi igka-dA"
							>
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('priceUSD')}>Price</div>
									{sortBy === 'priceUSD' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
							<div
								data-testid="percent-change-cell"
								className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-10 hJyIyF knzTRi fLOBMM"
							>
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('priceChangeUSD')}>Change</div>
									{sortBy === 'priceChangeUSD' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
							<div
								data-testid="tvl-cell"
								id="hwCfxy"
								className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-7 hJyIyF knzTRi fLGPoq"
							>
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('totalTvlUSD')}>TVL</div>
									{sortBy === 'totalTvlUSD' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
							<div id="volume-celll" data-testid="volume-cell" className="hJyIyF knzTRi gEaRbj">
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('volumeUSD')}>Volume</div>
									{sortBy === 'volumeUSD' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
						</div>

						{/* Data Body */}
						<div className="sc-19z0ycm-1 ejgNi">
							{isLoading ? (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										width: '100%',
										margin: '64px 0px',
									}}
								>
									<Loader size={30} />{' '}
								</div>
							) : filteredTableData && filteredTableData.length > 0 ? (
								filteredTableData.map(data => (
									<div key={data.tokenId} data-testid="token-table-row-NATIVE">
										<Link className="sc-1bit9h6-16 kiPA-dv" to={`/tokens/${data.tokenId}`}>
											<div className="sc-1bit9h6-1 cQmpaP">
												<div className="sc-1bit9h6-0 sc-1bit9h6-5 hJyIyF bwVaNf">{data.rank}</div>
												<div
													data-testid="name-cell"
													className="sc-1bit9h6-0 sc-1bit9h6-8 hJyIyF fLXlBW"
												>
													<div className="sc-1bit9h6-2 sc-1bit9h6-3 bvHTKj jqxpYK">
														<div className="sc-12k1pn4-3 eLvYRk">
															<div className="sc-12k1pn4-2 ckpBIe">
																<TokenAvatar
																	src={data.logo}
																	style={{ marginRight: '8px' }}
																	size={25}
																	tokenId={data.tokenId}
																/>
															</div>
															<div className="sc-12k1pn4-4 epsCee" />
														</div>
														<div className="sc-1bit9h6-0 sc-1bit9h6-17 hJyIyF gKCxsP">
															<div data-cy="token-name" className="sc-1bit9h6-18 kSNzln">
																{data.tokenName}
															</div>
															<div className="sc-1bit9h6-0 sc-1bit9h6-19 hJyIyF jRVRlR">
																{data.symbol}
															</div>
														</div>
													</div>
												</div>
												<div
													data-testid="price-cell"
													className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-9 hJyIyF dQscKx igka-dA"
													style={{
														display: 'flex',
														flexDirection: 'column',
														alignItems: 'end',
														justifyContent: 'center',
													}}
												>
													<div className="sc-1bit9h6-2 bvHTKj">
														<div className="sc-1bit9h6-0 sc-1bit9h6-12 hJyIyF eNYLXF">
															{`$${data.priceUSD.toFixed(4)}`}
															<div className="sc-1bit9h6-0 sc-1bit9h6-11 hJyIyF iQNhmM">
																<div className="sc-1nu6e54-7 cLYUzV"></div>
															</div>
														</div>
													</div>
													<div className="sc-1bit9h6-2 bvHTKj show-below-540 hide-above-540">
														<div className="sc-1nu6e54-7 cLYUzV"></div>
														<span className="sc-1nu6e54-2 braSjM">
															<span>{determineTrendIcon(data.priceChangeUSD)}</span>
															<span
																className=""
																style={{
																	color:
																		data.priceChangeUSD > 0
																			? 'rgb(118, 209, 145)'
																			: data.priceChangeUSD === 0
																				? 'rgb(118, 209, 145)'
																				: 'rgb(252, 83, 83)',
																}}
															>
																<span>{data.priceChangeUSD.toFixed(2)}%</span>
															</span>
														</span>
													</div>
												</div>
												<div
													data-testid="percent-change-cell"
													className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-10 hJyIyF dQscKx fLOBMM"
												>
													<div className="sc-1bit9h6-2 bvHTKj">
														<div className="sc-1nu6e54-7 cLYUzV"></div>
														<span className="sc-1nu6e54-2 braSjM">
															<span>{determineTrendIcon(data.priceChangeUSD)}</span>
															<span
																className=""
																style={{
																	color:
																		data.priceChangeUSD > 0
																			? 'rgb(118, 209, 145)'
																			: data.priceChangeUSD === 0
																				? 'rgb(118, 209, 145)'
																				: 'rgb(252, 83, 83)',
																}}
															>
																<span>{data.priceChangeUSD.toFixed(2)}%</span>
															</span>
														</span>
													</div>
												</div>
												<div
													data-testid="tvl-cell"
													className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-7 hJyIyF dQscKx fLGPoq"
												>
													<div className="sc-1bit9h6-2 bvHTKj">{`${compactFiatFormatter.format(
														data.totalTvlUSD.toFixed(2),
													)}`}</div>
												</div>
												<div
													data-testid="volume-cell"
													className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-20 hJyIyF dQscKx gEaRbj"
												>
													<div className="sc-1bit9h6-2 bvHTKj">{`${compactFiatFormatter.format(
														data.volumeUSD.toFixed(2),
													)}`}</div>
												</div>
												<div className="sc-1bit9h6-0 sc-1bit9h6-14 hJyIyF NpKpm">
													<div className="sc-1bit9h6-0 sc-1bit9h6-15 hJyIyF FLymZ">
														<div style={{ width: '100%', height: '100%' }}>
															{selectedService ? (
																<img
																	src={`${selectedService.serviceURLs}/static/img/sparklines/${
																		selectedTimeframe.value
																	}-${data.symbol.toLowerCase()}usd.svg`}
																	onError={e => (e.target.style.display = 'none')}
																/>
															) : (
																<div
																	style={{
																		width: '100%',
																		display: 'flex',
																		justifyContent: 'center',
																		alignItems: 'center',
																	}}
																>
																	<Loader size={20} />{' '}
																</div>
															)}
														</div>
													</div>
												</div>
											</div>
										</Link>
									</div>
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
			</div>
		</React.Fragment>
	);
};
export default Token;
