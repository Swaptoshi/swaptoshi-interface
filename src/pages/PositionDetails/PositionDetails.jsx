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
import NFTPositionCard from '../../components/Position/NFTPositionCard';
import PositionLiquidityCard from '../../components/Position/PositionLiquidityCard';
import PositionFeeCard from '../../components/Position/PositionFeeCard';
import PositionPriceRangeCard from '../../components/Position/PositionPriceRangeCard';

export default function PositionDetails() {
	const { id } = useParams();
	const { prices } = useLiskPrice();
	const { selectedService, chain } = useChain();
	const { senderPublicKey } = useWalletConnect();

	const [token0, setToken0] = React.useState('token0');
	const [token1, setToken1] = React.useState('token1');
	const [token0Price, setToken0Price] = React.useState(0);
	const [token1Price, setToken1Price] = React.useState(0);

	const [isLoading, setIsLoading] = React.useState(true);
	const [position, setPosition] = React.useState();
	const [postiionMetadata, setPositionMetadata] = React.useState();
	const [positionValue, setPostiionValue] = React.useState();

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

		setToken0Price(token0Price);
		setToken1Price(token1Price);
	}, [chain, position, selectedService, token0, token1]);

	const fetchPrices = useDebouncedCallback(async () => {
		await tryToast('Fetch token price failed', async () => {
			fetchTokenPrice();
		});
	}, 500);

	React.useEffect(() => {
		if (position && positionValue && prices && chain && token0 && token1) {
			fetchPrices();
		}
	}, [chain, fetchPrices, position, positionValue, prices, token0, token1]);

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
							<NavLink className="sc-djdxof-0 MpERT" to="/pools">
								<i className="ri-arrow-left-line"></i>
								Back to Pools
							</NavLink>
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
										<PrimaryButton
											disabled={
												positionValue[`principal${token0.slice(-1)}`] === '0' &&
												positionValue[`principal${token1.slice(-1)}`]
											}
										>
											Remove liquidity
										</PrimaryButton>
									</div>
								) : null}
							</div>
						</div>
						<div className="sc-aXZVg Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 PositionPage__ResponsiveRow-sc-f1e5edbd-7 dKubqp iYtcfo bIFEzi iYnZBs">
							<span
								className="components__HideSmall-sc-88ab9cb5-22 ebuyDK"
								style={{ height: '100%', marginRight: '12px' }}
							>
								<NFTPositionCard image={postiionMetadata.image} ipfsURL={position.tokenURI} />
							</span>
							<div
								className="Column__AutoColumn-sc-ae7ea350-2 cjBIlP"
								style={{ width: '100%', height: '100%' }}
							>
								<PositionLiquidityCard
									position={position}
									value={positionValue}
									token0={token0}
									token1={token1}
									token0Price={token0Price}
									token1Price={token1Price}
								/>
								<PositionFeeCard
									position={position}
									value={positionValue}
									token0={token0}
									token1={token1}
									token0Price={token0Price}
									token1Price={token1Price}
								/>
							</div>
						</div>
						<PositionPriceRangeCard
							position={position}
							token0={token0}
							token1={token1}
							onSwitch={handleSwitch}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
