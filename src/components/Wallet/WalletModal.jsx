import React from 'react';
import WalletModalHeader from './WalletModalHeader';
import ConnectWalletModal from './Connect/ConnectWalletModal';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import WalletAccount from './Account/WalletAccount';

export default function WalletModal({ show, onConfigClick, closeHandler }) {
	const { senderPublicKey } = useWalletConnect();
	const [mode, setMode] = React.useState('normal');

	React.useEffect(() => {
		if (show === false) {
			setMode('normal');
		}
	}, [show]);

	return show ? (
		<div data-testid="wallet-modal" className="sc-1hmbv05-0 jcIclM">
			<WalletModalHeader
				onConfigClick={onConfigClick}
				closeHandler={closeHandler}
				mode={mode}
				setMode={setMode}
			/>
			{senderPublicKey ? (
				<WalletAccount show={show} />
			) : (
				<ConnectWalletModal setMode={setMode} mode={mode} />
			)}
		</div>
	) : null;
}
