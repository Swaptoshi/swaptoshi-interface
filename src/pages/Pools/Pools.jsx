import React from 'react';
import './Pools.css';
import { useNavigate } from 'react-router-dom';
import PrimaryButton from '../../components/Button/PrimaryButton';
import SecondaryButton from '../../components/Button/SecondaryButton';
import WalletActionButton from '../../components/Button/WalletActionButton';
import { useWalletConnect } from '../../context/WalletConnectProvider';

const Pools = () => {
	const navigate = useNavigate();
	const { senderPublicKey } = useWalletConnect();

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
								<SecondaryButton className="pool-button">Create Pool</SecondaryButton>
								<div style={{ margin: '0px 8px' }} />
								<PrimaryButton className="pool-button" onClick={() => navigate('/liquidity')}>
									New Position
								</PrimaryButton>
							</div>
						</div>
					</div>
				</div>

				<main className="pools-connect-wallet-card">
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
				</main>
			</div>
		</div>
	);
};

export default Pools;
