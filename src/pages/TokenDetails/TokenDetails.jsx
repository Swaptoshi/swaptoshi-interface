import React, { useEffect, useState } from 'react';
import './TokenDetails.css';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import SwapWidget from '../../components/Swap/SwapWidget';
import { intervalToSecond } from '../../utils/time/intervalToSecond';
import { getDEXToken, getPriceOhlc, getPriceTick } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/toast/tryToast';
import { useKlayrPrice } from '../../context/KlayrPriceProvider';
import SwitchBox from '../../components/SwitchBox/SwitchBox';
import Loader from '../../components/Loader';
import { PriceChart } from '../../components/Chart/PriceChart';
import { intervalToLimit } from '../../utils/time/intervalToLimit';
import { timeframeToInterval } from '../../utils/time/timeframeToInterval';
import TokenAvatar from '../../components/Avatar/token';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../../utils/config/env';
import { intervalToTimeframe } from '../../utils/time/intervalToTimeframe';
import SecondaryButton from '../../components/Button/SecondaryButton';
import { getFactoryToken } from '../../service/factory';

const TokenDetails = () => {
	const { id } = useParams();
	const { fiatFormatter } = useKlayrPrice();
	const { selectedService } = useChain();

	const [token, setToken] = useState();
	const [chart, setChart] = useState();
	const [timeframe, setTimeframe] = useState('24h');
	const [graph, setGraph] = useState('tick');
	const [isLoading, setIsLoading] = useState(true);
	const [isCreatedFromFactory, setIsCreatedFromFactory] = React.useState(false);

	const fetchTickChart = React.useCallback(
		async (tokens, now) => {
			const lskUsdTick = await getPriceTick({
				base: 'KLY',
				quote: 'USD',
				interval: timeframeToInterval[timeframe],
				limit: intervalToLimit[timeframe],
				start: now - intervalToSecond[timeframe],
			});
			if (tokens.data[0].symbol !== 'KLY') {
				const tokenTick = await getPriceTick({
					base: tokens.data[0].symbol,
					quote: 'KLY',
					interval: timeframeToInterval[timeframe],
					limit: intervalToLimit[timeframe],
					start: now - intervalToSecond[timeframe],
				});

				if (tokenTick && tokenTick.data && lskUsdTick && lskUsdTick.data) {
					setChart(
						tokenTick.data.flatMap(t => {
							const matched = lskUsdTick.data.find(s => s.time === t.time);
							if (matched) {
								return {
									time: t.time,
									value: t.value * matched.value,
								};
							} else {
								return [];
							}
						}),
					);
				}
			} else {
				if (lskUsdTick && lskUsdTick.data) {
					setChart(lskUsdTick.data);
				}
			}
		},
		[timeframe],
	);

	const fetchOhlcChart = React.useCallback(
		async (tokens, now) => {
			const lskUsdTick = await getPriceOhlc({
				base: 'KLY',
				quote: 'USD',
				timeframe: intervalToTimeframe[timeframe],
				start: now - intervalToSecond[timeframe],
			});
			if (tokens.data[0].symbol !== 'KLY') {
				const tokenTick = await getPriceOhlc({
					base: tokens.data[0].symbol,
					quote: 'KLY',
					timeframe: intervalToTimeframe[timeframe],
					start: now - intervalToSecond[timeframe],
				});

				if (tokenTick && tokenTick.data && lskUsdTick && lskUsdTick.data) {
					setChart(
						tokenTick.data.flatMap(t => {
							const matched = lskUsdTick.data.find(s => s.time === t.time);
							if (matched) {
								return {
									time: t.time,
									open: t.open * matched.open,
									high: t.high * matched.high,
									low: t.low * matched.low,
									close: t.close * matched.close,
								};
							} else {
								return [];
							}
						}),
					);
				}
			} else {
				if (lskUsdTick && lskUsdTick.data) {
					setChart(lskUsdTick.data);
				}
			}
		},
		[timeframe],
	);

	const fetchTokenPrice = useDebouncedCallback(async () => {
		const run = async () => {
			const now = Math.floor(Date.now() / 1000);
			const param = {
				search: id,
				offset: 0,
				limit: 100,
				changeWindow: timeframe,
				start: now - intervalToSecond[timeframe],
				end: now,
			};
			const tokens = await getDEXToken(
				param,
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (tokens && tokens.data && tokens.data.length > 0) {
				setToken(tokens.data[0]);

				if (graph === 'tick') {
					await fetchTickChart(tokens, now);
				} else if (graph === 'ohlc') {
					await fetchOhlcChart(tokens, now);
				}

				const factoryTokens = await getFactoryToken(
					{ tokenIds: id, limit: 1 },
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (factoryTokens && factoryTokens.data && factoryTokens.data.length > 0) {
					setIsCreatedFromFactory(true);
				}
			}
			setIsLoading(false);
		};

		tryToast('Fetch token price failed', run, () => setIsLoading(false));
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	useEffect(() => {
		fetchTokenPrice();
	}, [fetchTokenPrice, id, selectedService, timeframe, graph]);

	function determineTrendIcon(priceChangeUSD) {
		if (priceChangeUSD > 0) {
			return (
				<i style={{ color: 'var(--green)' }} className="trends-up-icon ri-arrow-right-up-line"></i>
			);
		} else if (priceChangeUSD < 0) {
			return (
				<i
					style={{ color: 'var(--red)' }}
					className="trends-down-icon ri-arrow-right-down-line"
				></i>
			);
		} else if (priceChangeUSD === 0) {
			return (
				<i style={{ color: 'var(--green)' }} className="trends-up-icon ri-arrow-right-up-line"></i>
			);
		}
		return null;
	}

	return (
		<div>
			<div className="sc-1dv6j2d-0 bCNYil" style={{ paddingBottom: 0 }}>
				{isLoading ? (
					<div
						style={{
							width: '100%',
							height: '80vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Loader size={20} />{' '}
					</div>
				) : !token ? (
					<div
						style={{
							width: '100%',
							height: '80vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						Token not found
					</div>
				) : (
					<div className="sc-qwzj9s-1 fBEeS" style={{ paddingBottom: 0 }}>
						<div className="sc-qwzj9s-2 kUtZkz" key={token.tokenId} style={{ paddingBottom: 0 }}>
							<NavLink className="sc-djdxof-0 MpERT" to="/tokens">
								<i className="ri-arrow-left-line"></i>
								Tokens
							</NavLink>

							<div data-testid="token-info-container" className="sc-qwzj9s-6 kbDyok">
								<div className="sc-qwzj9s-7 hfZYqf">
									<div className="sc-12k1pn4-3 eLvYRk">
										<div className="sc-12k1pn4-2 fEQuSm">
											<TokenAvatar src={token.logo} size={30} tokenId={token.tokenId} />
										</div>
										<div className="sc-12k1pn4-4 izFcWZ" />
									</div>
									<div className="sc-1su5spn-2 gkgzJh">
										<span className="textclr">{token.tokenName}</span>
										<span className="sc-1su5spn-0 gRPQtw">{token.symbol}</span>
									</div>
								</div>
							</div>
							<div className="sc-qwzj9s-4 eDREki">
								<div data-testid="chart-container" className="sc-qwzj9s-4 eDREki">
									<div style={{ width: '100%', height: '100%' }}>
										<div data-cy="chart-header" className="sc-1nu6e54-3 hZgvDp">
											<span className="sc-1nu6e54-4 gLsRgG textclr">
												{fiatFormatter.format(token.priceUSD.toFixed(4))}
											</span>
											<div className="sc-1nu6e54-6 khjLim textclr">
												<span
													className="percentage-text"
													style={{
														color: token.priceChangeUSD >= 0 ? 'var(--green)' : 'var(--red)',
													}}
												>
													<span>{token.priceChangeUSD.toFixed(2)}%</span>
												</span>
												<span>{determineTrendIcon(token.priceChangeUSD)}</span>
											</div>
										</div>

										{chart ? <PriceChart data={chart} type={graph} /> : null}
									</div>
									<div className="sc-1wj62vu-0 ibmoxq token-switch-container">
										<div className="sc-1wj62vu-1 fvQpGv token-graph-switch">
											<SwitchBox
												value={graph}
												items={[
													{
														value: 'tick',
														component: (
															<i
																className="nav-dropdown ri-line-chart-line
"
															></i>
														),
														onClick: () => {
															setChart();
															setGraph('tick');
														},
													},
													{
														value: 'ohlc',
														component: (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="24"
																height="24"
																viewBox="0 0 24 24"
															>
																<g fill="none" stroke="currentColor">
																	<path strokeLinecap="round" d="M7.5 3.5v3m0 8v4" />
																	<path d="M6.8 6.5a1.3 1.3 0 0 0-1.3 1.3v5.4a1.3 1.3 0 0 0 1.3 1.3h1.4a1.3 1.3 0 0 0 1.3-1.3V7.8a1.3 1.3 0 0 0-1.3-1.3z" />
																	<path strokeLinecap="round" d="M16.5 6.5v5m0 5v4" />
																	<path d="M15.8 11.5a1.3 1.3 0 0 0-1.3 1.3v2.4a1.3 1.3 0 0 0 1.3 1.3h1.4a1.3 1.3 0 0 0 1.3-1.3v-2.4a1.3 1.3 0 0 0-1.3-1.3z" />
																</g>
															</svg>
														),
														onClick: () => {
															setChart();
															setGraph('ohlc');
														},
													},
												]}
											/>
										</div>
										<div style={{ flex: 1 }} />
										<div className="sc-1wj62vu-1 fvQpGv token-timeframe-switch">
											<SwitchBox
												value={timeframe}
												items={[
													{ value: '1h', component: '1H', onClick: () => setTimeframe('1h') },
													{ value: '24h', component: '1D', onClick: () => setTimeframe('24h') },
													{ value: '7d', component: '1W', onClick: () => setTimeframe('7d') },
													{ value: '30d', component: '1M', onClick: () => setTimeframe('30d') },
													{ value: '1y', component: '1Y', onClick: () => setTimeframe('1y') },
												]}
											/>
										</div>
									</div>
								</div>
							</div>
							<div data-testid="token-details-stats" className="sc-y05v5v-6 dlmcTg">
								<div className="sc-sx9n2y-0 kivXvb sc-y05v5v-3 cwCXFN css-1b492mu">
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<div>Stats</div>
										<div style={{ flex: 1 }} />
										{isCreatedFromFactory && selectedService ? (
											<SecondaryButton
												onClick={() =>
													window.open(
														`${selectedService.serviceURLs}/api/v3/factory/token/meta?tokenIds=${id}`,
														'_blank',
													)
												}
											>
												Open Metadata
											</SecondaryButton>
										) : null}
									</div>
								</div>
								<div className="sc-y05v5v-1 djRLxT">
									<div className="sc-y05v5v-2 fJhHgf">
										<div data-cy="rank" className="sc-y05v5v-0 iJvfTG">
											<div className="sc-d5tbhs-1 cSretk">
												<div>Rank</div>
											</div>
											<div className="sc-y05v5v-4 iydZZJ">#{token.rank}</div>
										</div>
										<div data-cy="tvl" className="sc-y05v5v-0 iJvfTG">
											<div className="sc-d5tbhs-1 cSretk">
												<div>TVL</div>
											</div>
											<div className="sc-y05v5v-4 iydZZJ">
												{fiatFormatter.format(token.totalTvlUSD.toFixed(2))}
											</div>
										</div>
										<div data-cy="volume-24h" className="sc-y05v5v-0 iJvfTG">
											<div className="sc-d5tbhs-1 cSretk">
												<div>{timeframe} Volume</div>
											</div>
											<div className="sc-y05v5v-4 iydZZJ">{`${fiatFormatter.format(
												token.volumeUSD.toFixed(2),
											)}`}</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="kFzxb">
							<SwapWidget withGlow initialQuoteToken={token} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TokenDetails;
