import React from 'react';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import PrimaryButton from './PrimaryButton';
import { useWalletModal } from '../../context/WalletModalProvider';

export default function WalletActionButton(props) {
	const { senderPublicKey, signClient, wcUri, connect } = useWalletConnect();
	const [, setWalletOpen] = useWalletModal();

	const handleOpenWallet = React.useCallback(() => {
		setWalletOpen(e => !e);
	}, [setWalletOpen]);

	const onConnectFailed = React.useCallback(() => {
		setWalletOpen(false);
	}, [setWalletOpen]);

	const connectHandler = React.useCallback(() => {
		handleOpenWallet();
		if (!wcUri) connect({ onFailed: onConnectFailed });
	}, [handleOpenWallet, wcUri, connect, onConnectFailed]);

	return senderPublicKey ? (
		<PrimaryButton {...props} disabled={props.disabled}>
			{props.children}
		</PrimaryButton>
	) : (
		<PrimaryButton
			{...props}
			onClick={connectHandler}
			disabled={senderPublicKey ? false : signClient === undefined}
		>
			Connect Wallet
		</PrimaryButton>
	);
}
