import React from 'react';
import './PositionDetails.css';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../../utils/config/env';
import {
	getDEXPosition,
	getDEXPositionMetadata,
	getDEXPositionValue,
	getPrice,
} from '../../service/dex';
import { NavLink, useParams } from 'react-router-dom';
import { useLiskPrice } from '../../context/LiskPriceProvider';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/toast/tryToast';
import Loader from '../../components/Loader';
import TokenAvatar from '../../components/Avatar/token';
import PriceRangeLabel from '../../components/Price/PriceRangeLabel';
import SecondaryButton from '../../components/Button/SecondaryButton';
import PrimaryButton from '../../components/Button/PrimaryButton';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { getIPFSUrl } from '../../utils/ipfs/url';
import Decimal from 'decimal.js';
import AmountLabelTooltiped from '../../components/Price/AmountLabelTooltiped';
import {
	getToken0PrincipalPercent,
	getToken1PrincipalPercent,
} from '../../utils/liquidity/principalPercentage';
import TokenSwitchBox from '../../components/SwitchBox/TokenSwitchBox';
import { decodeTickPrice } from '../../utils/math/priceFormatter';
import { getMaxTick, getMinTick } from '../../utils/tick/price_tick';
import { INFINITE, ZERO } from '../../utils/constants/tick';

export default function PositionDetails() {
	const { id } = useParams();
	const { prices, fiatFormatter } = useLiskPrice();
	const { selectedService, chain, dexConfig } = useChain();
	const { senderPublicKey } = useWalletConnect();

	const [token0, setToken0] = React.useState('token0');
	const [token1, setToken1] = React.useState('token1');

	const [isLoading, setIsLoading] = React.useState(true);
	const [position, setPosition] = React.useState();
	const [postiionMetadata, setPositionMetadata] = React.useState();
	const [positionValue, setPostiionValue] = React.useState();

	const [liquidityFiat, setLiquidityFiat] = React.useState();
	const [feeFiat, setFeeFiat] = React.useState();
	const inverted = React.useMemo(() => token0 !== 'token0', [token0]);

	const tokenA = React.useMemo(() => {
		return position
			? {
					tokenId: position[token0],
					symbol: position[`${token0}Symbol`],
				}
			: undefined;
	}, [position, token0]);

	const tokenB = React.useMemo(() => {
		return position
			? {
					tokenId: position[token1],
					symbol: position[`${token1}Symbol`],
				}
			: undefined;
	}, [position, token1]);

	const principalPercent = React.useMemo(() => {
		if (!position) return { token0: '0', token1: '0' };

		const token0 = (
			getToken0PrincipalPercent(position.poolTick, position.tickLower, position.tickUpper) * 100
		).toFixed(2);

		const token1 = (
			getToken1PrincipalPercent(position.poolTick, position.tickLower, position.tickUpper) * 100
		).toFixed(2);

		return {
			token0,
			token1,
		};
	}, [position]);

	const fetchTokenPrice = React.useCallback(async () => {
		let token0Price = 0;
		let token1Price = 0;

		const token0ToLskPrice = await getPrice(
			{
				baseTokenId: position[token0],
				quoteTokenId: `${chain}00000000000000`,
			},
			selectedService ? selectedService.serviceURLs : undefined,
		);
		if (token0ToLskPrice && token0ToLskPrice.data) {
			token0Price = token0ToLskPrice.data.price;
		}

		const token1ToLskPrice = await getPrice(
			{
				baseTokenId: position[token1],
				quoteTokenId: `${chain}00000000000000`,
			},
			selectedService ? selectedService.serviceURLs : undefined,
		);
		if (token1ToLskPrice && token1ToLskPrice.data) {
			token1Price = token1ToLskPrice.data.price;
		}

		return {
			token0Price,
			token1Price,
		};
	}, [chain, position, selectedService, token0, token1]);

	const fetchFeeFiat = React.useCallback(
		async (token0Price, token1Price) => {
			setFeeFiat();

			let token0FeePrice = 0;
			let token1FeePrice = 0;

			const token0Fee = new Decimal(positionValue[`fees${token0.slice(-1)}`]).div(
				10 ** Number(position[`${token0}Decimal`]),
			);
			const token1Fee = new Decimal(positionValue[`fees${token1.slice(-1)}`]).div(
				10 ** Number(position[`${token1}Decimal`]),
			);

			if (token0Price) {
				token0FeePrice = new Decimal(token0Fee.mul(token0Price));
			}

			if (token1Price) {
				token1FeePrice = new Decimal(token1Fee.mul(token1Price));
			}

			const total = new Decimal(token0FeePrice).add(token1FeePrice).mul(prices).toFixed(2);
			setFeeFiat(fiatFormatter.format(total));
		},
		[fiatFormatter, position, positionValue, prices, token0, token1],
	);

	const fetchLiquidityFiat = React.useCallback(
		async (token0Price, token1Price) => {
			setLiquidityFiat();

			let token0ValuePrice = 0;
			let token1ValuePrice = 0;

			const token0Value = new Decimal(positionValue[`principal${token0.slice(-1)}`]).div(
				10 ** Number(position[`${token0}Decimal`]),
			);
			const token1Value = new Decimal(positionValue[`principal${token1.slice(-1)}`]).div(
				10 ** Number(position[`${token1}Decimal`]),
			);

			if (token0Price) {
				token0ValuePrice = new Decimal(token0Value.mul(token0Price));
			}

			if (token1Price) {
				token1ValuePrice = new Decimal(token1Value.mul(token1Price));
			}

			const total = new Decimal(token0ValuePrice).add(token1ValuePrice).mul(prices).toFixed(2);
			setLiquidityFiat(fiatFormatter.format(total));
		},
		[fiatFormatter, position, positionValue, prices, token0, token1],
	);

	const fetchLiquidity = useDebouncedCallback(async () => {
		await tryToast('Fetch token price failed', async () => {
			const { token0Price, token1Price } = await fetchTokenPrice();
			await fetchLiquidityFiat(token0Price, token1Price);
			await fetchFeeFiat(token0Price, token1Price);
		});
	}, 500);

	React.useEffect(() => {
		if (position && positionValue && prices && chain && token0 && token1) {
			fetchLiquidity();
		}
	}, [chain, fetchLiquidity, position, positionValue, prices, token0, token1]);

	const getTickSpacing = React.useCallback(
		fee => {
			if (dexConfig) {
				const tickSpacing = dexConfig.feeAmountTickSpacing.find(t => t[0] === fee.toString());
				if (tickSpacing) {
					return tickSpacing[1];
				}
			}
			return '0';
		},
		[dexConfig],
	);

	const handleSwitch = React.useCallback(() => {
		setToken0(t => (t === 'token0' ? 'token1' : 'token0'));
		setToken1(t => (t === 'token1' ? 'token0' : 'token1'));
	}, []);

	const fetchPosition = useDebouncedCallback(async () => {
		const run = async () => {
			const pos = await getDEXPosition(
				{ search: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (pos && pos.data && pos.data.length > 0) {
				setPosition(pos.data[0]);
			}

			const metadata = await getDEXPositionMetadata(
				{ tokenId: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (metadata && metadata.data) {
				setPositionMetadata(metadata.data);
			}

			const value = await getDEXPositionValue(
				{ tokenId: id },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (value && value.data) {
				setPostiionValue(value.data.value);
			}

			setIsLoading(false);
		};

		tryToast('Fetch positions failed', run, () => setIsLoading(false));
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		fetchPosition();
	}, [fetchPosition]);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				paddingTop: '72px',
			}}
		>
			<div
				className="PositionPage__PageWrapper-sc-f1e5edbd-1 gAJfJa"
				style={{ padding: '48px 20px 72px 20px' }}
			>
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
				) : !position || !postiionMetadata || !positionValue ? (
					<div
						style={{
							width: '100%',
							height: '80vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						Liquidity position not found
					</div>
				) : (
					<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
						<div className="Column__AutoColumn-sc-ae7ea350-2 cjBIlP">
							<a
								data-cy="visit-pool"
								href="/pools"
								style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '0.5rem' }}
							>
								<NavLink className="sc-djdxof-0 MpERT" to="/pools">
									<i className="ri-arrow-left-line"></i>
									Back to Pools
								</NavLink>
							</a>
							<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 PositionPage__ResponsiveRow-sc-f1e5edbd-7 dKubqp cPCYrp bIFEzi iYnZBs">
								<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 PositionPage__PositionLabelRow-sc-f1e5edbd-14 dKubqp cPCYrp haLsDq kjbeBO">
									<div style={{ display: 'flex', alignItems: 'center' }}>
										<TokenAvatar
											src={position[`${token0}Logo`]}
											size={24}
											tokenId={position[token0]}
										/>
										<TokenAvatar
											src={position[`${token1}Logo`]}
											size={24}
											tokenId={position[token1]}
											style={{ marginLeft: '-10px' }}
										/>
										<div style={{ margin: '0px 4px' }} />
										<div style={{ color: 'var(--color-white)', fontSize: '20px', fontWeight: 600 }}>
											{position[`${token0}Symbol`]} / {position[`${token1}Symbol`]}
										</div>
										<div style={{ margin: '0px 4px' }} />
										<div
											style={{
												color: 'var(--color-white)',
												fontSize: '16px',
												fontWeight: 200,
												backgroundColor: 'var(--nav-drop)',
												padding: '2px 12px',
												borderRadius: '8px',
												border: 'var(--card-border-color)',
											}}
										>
											{position.fee / 10000}%
										</div>
									</div>
									<PriceRangeLabel
										liquidity={position.liquidity}
										currentTick={position.poolTick}
										tickLower={position.tickLower}
										tickUpper={position.tickUpper}
									/>
								</div>
								{senderPublicKey ? (
									<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 PositionPage__ResponsiveRow-sc-f1e5edbd-7 PositionPage__ActionButtonResponsiveRow-sc-f1e5edbd-8 dKubqp cPCYrp bIFEzi iYnZBs gvfQYr">
										<SecondaryButton>Increase liquidity</SecondaryButton>
										<div style={{ width: '8px' }} />
										<PrimaryButton>Remove liquidity</PrimaryButton>
									</div>
								) : null}
							</div>
						</div>
						<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 PositionPage__ResponsiveRow-sc-f1e5edbd-7 dKubqp iYtcfo bIFEzi iYnZBs">
							<span
								className="components__HideSmall-sc-88ab9cb5-22 ebuyDK"
								style={{ height: '100%', marginRight: '12px' }}
							>
								<div
									width="100%"
									height="100%"
									className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 gFAiiM frINir iqvqwM"
									style={{
										minWidth: '340px',
										display: 'flex',
										alignItems: 'center',
										flexDirection: 'column',
										justifyContent: 'space-around',
									}}
								>
									<div className="PositionPage__NFTGrid-sc-f1e5edbd-10 gGqapu">
										<canvas
											className="PositionPage__NFTCanvas-sc-f1e5edbd-11 hOKIdu"
											width="464"
											height="800"
											style={{ width: '232px', height: '400px' }}
										></canvas>
										<img
											src={postiionMetadata.image}
											hidden=""
											className="PositionPage__NFTImage-sc-f1e5edbd-12 apbUF"
										/>
									</div>
									<a
										href={getIPFSUrl(position.tokenURI)}
										target={'_blank'}
										rel="noreferrer"
										style={{ color: 'var(--model-btn-hover)' }}
									>
										View on IPFS
									</a>
								</div>
							</span>
							<div
								className="Column__AutoColumn-sc-ae7ea350-2 cjBIlP"
								style={{ width: '100%', height: '100%' }}
							>
								<div className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 dKubqp frINir iqvqwM">
									<div
										className="Column__AutoColumn-sc-ae7ea350-2 eoejgw"
										style={{ width: '100%' }}
									>
										<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
											<div className="text__TextWrapper-sc-fbb4b34d-0 UseHi PositionPage__Label-sc-f1e5edbd-3 dJrcRo css-1aulwug text">
												Liquidity
											</div>
											<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-cbqu6f">
												{liquidityFiat ? liquidityFiat : '-'}
											</div>
										</div>
										<div className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 cxkBqB fejats eNAPHe">
											<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
												<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<TokenAvatar
															src={position[`${token0}Logo`]}
															size={20}
															tokenId={position[token0]}
															style={{ marginRight: '0.5rem' }}
														/>
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															{position[`${token0}Symbol`]}
														</div>
													</div>
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															<AmountLabelTooltiped
																amount={positionValue[`principal${token0.slice(-1)}`]}
																decimal={position[`${token0}Decimal`]}
																symbol={position[`${token0}Symbol`]}
																limit={'0.001'}
																precision={2}
															/>
														</div>
														<div
															className="Badge-sc-8f0f9d15-0 kjyCWx"
															style={{ marginLeft: '10px', width: '70px' }}
														>
															<div className="PositionPage__BadgeText-sc-f1e5edbd-2 kzEqix">
																{principalPercent[token0]}%
															</div>
														</div>
													</div>
												</div>
												<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<TokenAvatar
															src={position[`${token1}Logo`]}
															size={20}
															tokenId={position[token1]}
															style={{ marginRight: '0.5rem' }}
														/>
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															{position[`${token1}Symbol`]}
														</div>
													</div>
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															<AmountLabelTooltiped
																amount={positionValue[`principal${token1.slice(-1)}`]}
																decimal={position[`${token1}Decimal`]}
																symbol={position[`${token1}Symbol`]}
																limit={'0.001'}
																precision={2}
															/>
														</div>
														<div
															className="Badge-sc-8f0f9d15-0 kjyCWx"
															style={{ marginLeft: '10px', width: '70px' }}
														>
															<div className="PositionPage__BadgeText-sc-f1e5edbd-2 kzEqix">
																{principalPercent[token1]}%
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 dKubqp frINir iqvqwM">
									<div
										className="Column__AutoColumn-sc-ae7ea350-2 eoejgw"
										style={{ width: '100%' }}
									>
										<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
											<div
												className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi"
												style={{ alignItems: 'flex-start' }}
											>
												<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
													<div className="text__TextWrapper-sc-fbb4b34d-0 UseHi PositionPage__Label-sc-f1e5edbd-3 dJrcRo css-1aulwug">
														Unclaimed fees
													</div>
													<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-cbqu6f">
														{feeFiat ? feeFiat : '-'}
													</div>
												</div>
												{senderPublicKey ? <PrimaryButton>Collect fees</PrimaryButton> : null}
											</div>
										</div>
										<div className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 cxkBqB fejats eNAPHe">
											<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
												<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<TokenAvatar
															src={position[`${token0}Logo`]}
															size={20}
															tokenId={position[token0]}
															style={{ marginRight: '0.5rem' }}
														/>
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															{position[`${token0}Symbol`]}
														</div>
													</div>
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															<AmountLabelTooltiped
																amount={positionValue[`fees${token0.slice(-1)}`]}
																decimal={position[`${token0}Decimal`]}
																symbol={position[`${token0}Symbol`]}
																limit={'0.001'}
																precision={2}
															/>
														</div>
													</div>
												</div>
												<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<TokenAvatar
															src={position[`${token1}Logo`]}
															size={20}
															tokenId={position[token1]}
															style={{ marginRight: '0.5rem' }}
														/>
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															{position[`${token1}Symbol`]}
														</div>
													</div>
													<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
														<div className="text__TextWrapper-sc-fbb4b34d-0 bRgygV css-1aulwug">
															<AmountLabelTooltiped
																amount={positionValue[`fees${token1.slice(-1)}`]}
																decimal={position[`${token1}Decimal`]}
																symbol={position[`${token1}Symbol`]}
																limit={'0.001'}
																precision={2}
															/>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="sc-aXZVg Card-sc-a1e3c85c-0 Card__DarkCard-sc-a1e3c85c-4 dKubqp frINir iqvqwM">
							<div className="Column__AutoColumn-sc-ae7ea350-2 eoejgw">
								<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
									<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
										<div
											className="text__TextWrapper-sc-fbb4b34d-0 UseHi PositionPage__Label-sc-f1e5edbd-3 dJrcRo css-1sy3474"
											style={{ marginRight: '12px' }}
										>
											Price range
										</div>
										<PriceRangeLabel
											liquidity={position.liquidity}
											currentTick={position.poolTick}
											tickLower={position.tickLower}
											tickUpper={position.tickUpper}
										/>
									</div>
									<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 dKubqp cPCYrp haLsDq">
										<div style={{ width: 'fit-content', display: 'flex', alignItems: 'center' }}>
											<TokenSwitchBox tokenA={tokenA} tokenB={tokenB} onSwitch={handleSwitch} />
										</div>
									</div>
								</div>
								<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 dKubqp cPCYrp bIFEzi">
									<div
										width="100%"
										className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 bUrEIp ebBnOr eNAPHe"
									>
										<div className="Column__AutoColumn-sc-ae7ea350-2 dtsltc">
											<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
												Min price
											</span>
											<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-5dyzfr">
												{position.tickLower.toString() === getMinTick(getTickSpacing(position.fee))
													? ZERO
													: decodeTickPrice(
															position.tickLower,
															position[`${token0}Decimal`],
															position[`${token1}Decimal`],
															inverted,
														)}
											</div>
											<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
												{position[`${token0}Symbol`]} per {position[`${token1}Symbol`]}
											</span>
										</div>
									</div>
									<span className="PositionPage__DoubleArrow-sc-f1e5edbd-6 cUfrhq">⟷</span>
									<div
										width="100%"
										className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 bUrEIp ebBnOr eNAPHe"
									>
										<div className="Column__AutoColumn-sc-ae7ea350-2 dtsltc">
											<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
												Max price
											</span>
											<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-5dyzfr">
												{position.tickUpper.toString() === getMaxTick(getTickSpacing(position.fee))
													? INFINITE
													: decodeTickPrice(
															position.tickUpper,
															position[`${token0}Decimal`],
															position[`${token1}Decimal`],
															inverted,
														)}
											</div>
											<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
												{position[`${token0}Symbol`]} per {position[`${token1}Symbol`]}
											</span>
										</div>
									</div>
								</div>
								<div className="sc-aXZVg Card-sc-a1e3c85c-0 Card__LightCard-sc-a1e3c85c-1 hLDwqe ebBnOr eNAPHe">
									<div className="Column__AutoColumn-sc-ae7ea350-2 dtsltc">
										<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
											Current price
										</span>
										<div className="text__TextWrapper-sc-fbb4b34d-0 ennNJZ css-5dyzfr">
											{decodeTickPrice(
												position.poolTick,
												position[`${token0}Decimal`],
												position[`${token1}Decimal`],
												inverted,
											)}
										</div>
										<span className="PositionPage__ExtentsText-sc-f1e5edbd-4 kyqFWH">
											{position[`${token0}Symbol`]} per {position[`${token1}Symbol`]}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
