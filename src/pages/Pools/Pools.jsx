/* eslint-disable no-mixed-spaces-and-tabs */
import React from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import './Pools.css';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/Button/PrimaryButton';
import SecondaryButton from '../../components/Button/SecondaryButton';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { getDEXPosition } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/Toast/tryToast';
import Loader from '../../components/Loader';
import { MAX_TICK, MIN_TICK } from '../../constants/tick';
import { decodeTickPrice } from '../../utils/Math/priceFormatter';

const Pools = () => {
	const navigate = useNavigate();
	const { senderPublicKey } = useWalletConnect();
	const { selectedService } = useChain();

	const [position, setPosition] = React.useState();
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		const run = async () => {
			if (senderPublicKey) {
				const ownedPosition = await getDEXPosition(
					{
						search: cryptography.address.getLisk32AddressFromPublicKey(
							Buffer.from(senderPublicKey, 'hex'),
						),
						limit: 100,
					},
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (ownedPosition && ownedPosition.data) {
					setPosition(ownedPosition.data);
				}
			}
		};

		tryToast('Fetch owned position failed', run, undefined, () => setIsLoading(false));
	}, [selectedService, senderPublicKey]);

	return (
		<div className="container-pool">
			<div id="poolsContainer" className="pools-container">
				<div className="pool-wrapper">
					<div className="pools-content" style={{ width: '100%' }}>
						<div
							id="poolsHead"
							className="pools-head-content"
							style={{ minWidth: 0, boxSizing: 'border-box' }}
						>
							<p className="pools-left">Pools</p>
							<div id="poolRight" className="pool-right right knSXeI">
								<SecondaryButton onClick={() => navigate('/create-pool')} className="pool-button">
									Create Pool
								</SecondaryButton>
								<div style={{ margin: '0px 8px' }} />
								<PrimaryButton className="pool-button" onClick={() => navigate('/liquidity')}>
									New Position
								</PrimaryButton>
							</div>
						</div>
					</div>
				</div>

				<main className="pools-connect-wallet-card">
					{isLoading ? (
						<div
							style={{
								height: '250px',
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Loader size={40} />
						</div>
					) : position && position.length === 0 ? (
						<div className="pools-connect-wallet-card-wrapper">
							<div
								className="sc-sx9n2y-0 kandXm css-hzsvkq"
								style={{
									height: '250px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div>
									<i className="inbox ri-inbox-2-line"></i>
									<div>Your active liquidity positions will appear here.</div>
									{senderPublicKey ? null : (
										<WalletActionButton style={{ width: '100%', margin: '16px 0' }}>
											Loading...
										</WalletActionButton>
									)}
								</div>
							</div>
						</div>
					) : null}

					{position && position.length > 0 ? (
						<div>
							<div>
								<div style={{ margin: '12px 0px 8px 24px', color: 'var(--color-white)' }}>
									Your positions
								</div>
								<div style={{ height: 1, backgroundColor: 'var(--border)' }} />
							</div>

							{position.map(pos => {
								return (
									<div key={pos.tokenId} className={'position-item'} style={{ padding: '20px' }}>
										<div style={{ display: 'flex' }}>
											<div style={{ flex: 1 }}>
												<div style={{ display: 'flex' }}>
													<img
														src={pos.token0Logo}
														style={{ borderRadius: '24px', height: '24px', width: '24px' }}
													/>
													<img
														src={pos.token1Logo}
														style={{
															borderRadius: '24px',
															height: '24px',
															width: '24px',
															marginLeft: '-10px',
														}}
													/>
													<div style={{ margin: '0px 4px' }} />
													<div style={{ color: 'var(--color-white)', fontWeight: 600 }}>
														{pos.token0Symbol} / {pos.token1Symbol}
													</div>
													<div style={{ margin: '0px 4px' }} />
													<div style={{ color: 'var(--color-white)', fontWeight: 200 }}>
														{pos.fee / 10000}%
													</div>
												</div>
												<div style={{ margin: '12px 0px' }} />
												<div style={{ fontSize: '14px', color: 'var(--text-clr)' }}>{`${
													pos.tickLower === MIN_TICK
														? '0'
														: decodeTickPrice(pos.tickLower, pos.token0Decimal, pos.token1Decimal)
												} ${pos.token0Symbol} per ${pos.token1Symbol} ↔ ${
													pos.tickUpper === MAX_TICK
														? '∞'
														: decodeTickPrice(pos.tickUpper, pos.token0Decimal, pos.token1Decimal)
												} ${pos.token0Symbol} per ${pos.token1Symbol}`}</div>
											</div>
											<div
												style={{ fontSize: '14px', color: 'var(--color-white)', fontWeight: 200 }}
											>
												{pos.liquidity === 0
													? 'closed'
													: pos.poolTick < pos.tickLower || pos.poolTick > pos.tickUpper
														? 'out of range'
														: 'in range'}
											</div>
										</div>
									</div>
								);
							})}
						</div>
					) : null}
				</main>
			</div>
		</div>
	);
};

export default Pools;
