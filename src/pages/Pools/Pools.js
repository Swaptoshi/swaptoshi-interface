import React from 'react';
import './Pools.css';
import { NavLink } from 'react-router-dom';
import { useWalletModal } from '../../context/WalletModal';

const Pools = () => {
	const [, setIsModalOpen] = useWalletModal();
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
								<div id="moreDrop" className="more-drop">
									<button id="moreBtn" className="more-btn btn-more button">
										<div id="moreText" className="more-text bYPKDz">
											More
											<i className="drop ri-arrow-down-s-line"></i>
										</div>
									</button>
								</div>
								<NavLink
									data-cy="join-pool-button"
									id="join-pool-button"
									className="bYPKDz kEIpOD hPbqJv"
									to="/liquidity"
								>
									+ New Position
								</NavLink>
							</div>
						</div>
					</div>
				</div>

				{/* Connect WALLET CARD */}
				<main className="pools-connect-wallet-card">
					<div className="pools-connect-wallet-card-wrapper">
						<div className="sc-sx9n2y-0 kandXm css-hzsvkq">
							{/* <img
                                src='/assets/images/inbox-one.png'
                                alt='inbox'
                                className='inbox'
                                style={{ marginTop: "2em" }} /> */}
							<i className="inbox ri-inbox-2-line"></i>
							<div>Your active V3 liquidity positions will appear here.</div>
							<button
								id="poolsConnectBtn"
								className="pools-connect-wallet-btn pool-btn"
								onClick={() => setIsModalOpen(true)}
							>
								Connect a wallet
							</button>
						</div>
					</div>
				</main>

				<section className="byeFaZ">
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-"
						className="koQguv kXQhFl"
					>
						<div className="sc-1kykgp9-2 sc-1dn0qar-3 jdTKGL dzTOMd">
							<div className="sc-sx9n2y-0 linking sc-1dn0qar-2 cHXTrK css-1lohbqv">
								Learn about providing liquidity ↗
							</div>
							<div
								className="sc-sx9n2y-0 linking css-1jljtub"
								style={{ alignItems: 'center', display: 'flex' }}
							>
								Check out our v3 LP walkthrough and migration guides.
							</div>
						</div>
					</a>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href="https://info.uniswap.org/#/pools"
						data-testid="cta-infolink"
						className="sc-7yzmni-9 koQguv sc-1dn0qar-1 kXQhFl"
					>
						<div className="sc-1kykgp9-2 sc-1dn0qar-3 jdTKGL dzTOMd">
							<div
								className="sc-sx9n2y-0 linking sc-1dn0qar-2 cHXTrK css-1lohbqv"
								style={{ alignSelf: 'flex-start' }}
							>
								Top pools ↗
							</div>
							<div className="sc-sx9n2y-0 linking css-1jljtub" style={{ alignSelf: 'flex-start' }}>
								Explore Uniswap Analytics.
							</div>
						</div>
					</a>
				</section>
			</div>
		</div>
	);
};

export default Pools;
