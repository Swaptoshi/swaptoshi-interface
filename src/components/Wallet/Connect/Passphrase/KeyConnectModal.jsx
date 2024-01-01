import React from 'react';
import PrimaryButton from '../../../Button/PrimaryButton';
import SecondaryButton from '../../../Button/SecondaryButton';

export default function KeyConnectModal({ setMode }) {
	return (
		<div className="sc-1kykgp9-2 kqzAOQ">
			<div>
				<div className="sc-1hmbv05-2 ilYVNX">
					<div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
						If you&apos;re experiencing difficulty connecting your Lisk Wallet, you can either
						import your existing secret recovery phrase or generate a new one for a fresh account.
					</div>
				</div>

				<div style={{ height: '16px' }} />

				<PrimaryButton onClick={() => setMode('import')} style={{ width: '100%' }}>
					Import Phrase
				</PrimaryButton>

				<div style={{ height: '16px' }} />

				<SecondaryButton onClick={() => setMode('create')} style={{ width: '100%' }}>
					Create New Account
				</SecondaryButton>
			</div>
		</div>
	);
}
