import React from 'react';
import WalletConnectModal from './WalletConnect/WalletConnectModal';
import KeyConnectModal from './Passphrase/KeyConnectModal';
import CreateNewKeyModal from './Passphrase/CreateNewKeyModal';
import SetKeyPasswordModal from './Passphrase/SetKeyPasswordModal';
import ImportKeyModal from './Passphrase/ImportKeyModal';

export default function ConnectWalletModal({ mode, setMode }) {
	return mode === 'normal' ? (
		<WalletConnectModal setMode={setMode} />
	) : mode === 'key' ? (
		<KeyConnectModal setMode={setMode} />
	) : mode === 'create' ? (
		<CreateNewKeyModal setMode={setMode} />
	) : mode === 'password' ? (
		<SetKeyPasswordModal setMode={setMode} />
	) : mode === 'import' ? (
		<ImportKeyModal setMode={setMode} />
	) : null;
}
