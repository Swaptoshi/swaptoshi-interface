/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import * as liskPassphrase from '@liskhq/lisk-passphrase';
import * as cryptography from '@liskhq/lisk-cryptography';
import Avatar from '../../../Avatar';
import PrimaryButton from '../../../Button/PrimaryButton';
import RadioButton from '../../../Radio/RadioButton';
import Tooltip from '../../../Tooltip/Tooltip';
import { useWalletConnect } from '../../../../context/WalletConnectProvider';

const defaultKeyPath = "m/44'/134'/0'";

export default function CreateNewKeyModal({ setMode }) {
	const { storePrivateKey, setSenderPublicKey } = useWalletConnect();

	const [passphrase, setPassphrase] = React.useState();
	const [privateKey, setPrivateKey] = React.useState();
	const [isSaved, setIsSaved] = React.useState(true);

	const onNext = React.useCallback(() => {
		storePrivateKey(privateKey);
		if (isSaved) {
			setMode('password');
		} else {
			setSenderPublicKey(
				cryptography.ed.getPublicKeyFromPrivateKey(Buffer.from(privateKey, 'hex')).toString('hex'),
			);
			setMode('normal');
		}
	}, [isSaved, privateKey, setMode, setSenderPublicKey, storePrivateKey]);

	React.useEffect(() => {
		const run = async () => {
			const generatedPassphrase = liskPassphrase.Mnemonic.generateMnemonic();
			setPassphrase(generatedPassphrase);
			setPrivateKey(
				(
					await cryptography.ed.getPrivateKeyFromPhraseAndPath(generatedPassphrase, defaultKeyPath)
				).toString('hex'),
			);
		};

		run();
	}, []);

	return privateKey ? (
		<div className="sc-1kykgp9-2 kqzAOQ">
			<div>
				<div className="sc-1hmbv05-2 ilYVNX">
					<div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
						Please save your secret recovery phrase. Keep it safe as it is the only way to access
						your wallet.
					</div>
				</div>

				<div style={{ height: '32px' }} />

				<div
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
				>
					<Avatar
						address={cryptography.address.getLisk32AddressFromAddress(
							cryptography.address.getAddressFromPrivateKey(Buffer.from(privateKey, 'hex')),
						)}
						size={60}
					/>
				</div>

				<div style={{ height: '32px' }} />

				<div style={{ width: '100%', wordWrap: 'break-word' }}>
					<div style={{ color: 'rgb(119 128 160)', fontSize: '12px' }}>Address</div>
					<div style={{ color: 'var(--color-white)', fontSize: '12px' }}>
						{cryptography.address.getLisk32AddressFromAddress(
							cryptography.address.getAddressFromPrivateKey(Buffer.from(privateKey, 'hex')),
						)}
					</div>

					<div style={{ height: '16px' }} />

					<div style={{ color: 'rgb(119 128 160)', fontSize: '12px' }}>
						Key Derivation Path (default)
					</div>
					<div style={{ color: 'var(--color-white)', fontSize: '12px' }}>{defaultKeyPath}</div>

					<div style={{ height: '16px' }} />

					<div style={{ color: 'rgb(119 128 160)', fontSize: '12px' }}>Passphrase (12-word)</div>
					<div style={{ color: 'var(--color-white)', fontSize: '12px' }}>{passphrase}</div>
				</div>
			</div>
			<div style={{ flex: 1 }} />
			<RadioButton
				title={
					<div style={{ display: 'flex' }}>
						Save account
						<Tooltip
							content={
								"A saved account will be securely stored on this browser protected by a password you'll create next. An unsaved account will be cleared if you leave this app"
							}
						>
							<i
								style={{ margin: '0 4px', color: 'var(--text-clr)' }}
								className="ri-information-line"
							></i>
						</Tooltip>
					</div>
				}
				selected={isSaved}
				onClick={() => setIsSaved(t => !t)}
			/>
			<div style={{ height: '12px' }} />
			<PrimaryButton onClick={onNext}>Create Account</PrimaryButton>
		</div>
	) : null;
}
