import React, { useEffect, useState } from 'react';
import './TokenDetails.css';
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import SwapWidget from '../../components/Swap/SwapWidget';
import { intervalToSecond } from '../../utils/time/intervalToSecond';
import { getDEXToken, getPriceTick } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/toast/tryToast';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import SwitchBox from '../../components/SwitchBox/SwitchBox';
import Loader from '../../components/Loader';
import { PriceChart } from '../../components/Chart/PriceChart';
import { intervalToLimit } from '../../utils/time/intervalToLimit';
import { timeframeToInterval } from '../../utils/time/timeframeToInterval';
import TokenAvatar from '../../components/Avatar/token';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../../utils/config/env';

const TokenDetails = () => {
	const { id } = useParams();
	const { fiatFormatter } = useLiskPrice();
	const { selectedService } = useChain();

	const [token, setToken] = useState();
	const [chart, setChart] = useState();
	const [timeframe, setTimeframe] = useState('24h');
	const [isLoading, setIsLoading] = useState(true);

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
			if (tokens && tokens.data) {
				setToken(tokens.data[0]);

				const lskUsdTick = await getPriceTick({
					base: 'LSK',
					quote: 'USD',
					interval: timeframeToInterval[timeframe],
					limit: intervalToLimit[timeframe],
					start: now - intervalToSecond[timeframe],
				});
				if (tokens.data[0].symbol !== 'LSK') {
					const tokenTick = await getPriceTick({
						base: tokens.data[0].symbol,
						quote: 'LSK',
						interval: timeframeToInterval[timeframe],
						limit: intervalToLimit[timeframe],
						start: now - intervalToSecond[timeframe],
					});

					if (tokenTick && tokenTick.data && lskUsdTick && lskUsdTick.data) {
						setChart(
							tokenTick.data.map(t => {
								const matched = lskUsdTick.data.find(s => s.time === t.time);
								if (matched) {
									return {
										time: t.time,
										value: t.value * matched.value,
									};
								} else {
									return t;
								}
							}),
						);
					}
				} else {
					if (lskUsdTick && lskUsdTick.data) {
						setChart(lskUsdTick.data);
					}
				}
			}
			setIsLoading(false);
		};

		tryToast('Fetch token price failed', run, () => setIsLoading(false));
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	useEffect(() => {
		fetchTokenPrice();
	}, [fetchTokenPrice, id, selectedService, timeframe]);

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
												{/* 0.38% */}

												<span
													className="percentage-text"
													style={{
														color:
															token.priceChangeUSD >= 0 ? 'rgb(118, 209, 145)' : 'rgb(252, 83, 83)',
													}}
												>
													<span>{token.priceChangeUSD.toFixed(2)}%</span>
												</span>
												<span>{determineTrendIcon(token.priceChangeUSD)}</span>
											</div>
										</div>

										{chart ? <PriceChart data={chart} /> : null}
									</div>
									<div className="sc-1wj62vu-0 ibmoxq">
										<div className="sc-1wj62vu-1 fvQpGv" style={{ width: '250px' }}>
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
								<div className="sc-sx9n2y-0 kivXvb sc-y05v5v-3 cwCXFN css-1b492mu">Stats</div>
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
											{/* <div className="sc-y05v5v-4 iydZZJ">$276.8M</div> */}
											<div className="sc-y05v5v-4 iydZZJ">{`${fiatFormatter.format(
												token.volumeUSD.toFixed(2),
											)}`}</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="kFzxb">
							<SwapWidget initialQuoteToken={token} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default TokenDetails;
