import React from 'react';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import PrimaryButton from './PrimaryButton';
import { useWalletModal } from '../../context/WalletModalProvider';

export default function WalletActionButton(props) {
	const { senderPublicKey, signClient } = useWalletConnect();
	const [, setWalletOpen] = useWalletModal();

	const handleOpenWallet = React.useCallback(() => {
		setWalletOpen(e => !e);
	}, [setWalletOpen]);

	return senderPublicKey ? (
		<PrimaryButton {...props}>{props.children}</PrimaryButton>
	) : (
		<PrimaryButton onClick={handleOpenWallet} disabled={signClient === undefined} {...props}>
			Connect Wallet
		</PrimaryButton>
	);
}
