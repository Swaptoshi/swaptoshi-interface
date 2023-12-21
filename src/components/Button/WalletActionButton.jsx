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
		<PrimaryButton
			{...props}
			style={{ ...props.style, opacity: props.disabled === true ? 0.5 : 1 }}
		>
			{props.children}
		</PrimaryButton>
	) : (
		<PrimaryButton
			{...props}
			onClick={connectHandler}
			disabled={signClient === undefined}
			style={{ ...props.style, opacity: signClient === undefined ? 0.5 : 1 }}
		>
			Connect Wallet
		</PrimaryButton>
	);
}
