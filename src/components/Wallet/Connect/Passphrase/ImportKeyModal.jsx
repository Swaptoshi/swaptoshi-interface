import React from 'react';
import * as liskPassphrase from '@liskhq/lisk-passphrase';
import * as cryptography from '@liskhq/lisk-cryptography';
import RadioButton from '../../../Radio/RadioButton';
import Tooltip from '../../../Tooltip/Tooltip';
import PrimaryButton from '../../../Button/PrimaryButton';
import { useWalletConnect } from '../../../../context/WalletConnectProvider';
import TextAreaInput from '../../../Forms/TextAreaInput';
import { useDebouncedCallback } from 'use-debounce';
import TextInput from '../../../Forms/TextInput';
import { DEFAULT_KEY_PATH } from '../../../../utils/constants/address';

export default function ImportKeyModal({ setMode }) {
	const { storePrivateKey, setSenderPublicKey } = useWalletConnect();

	const [passphrase, setPassphrase] = React.useState('');
	const [isChecking, setIsChecking] = React.useState(false);
	const [isLegacy, setIsLegacy] = React.useState(false);
	const [path, setPath] = React.useState(DEFAULT_KEY_PATH);
	const [error, setError] = React.useState([]);
	const [isSaved, setIsSaved] = React.useState(true);

	const checkValidPassphrase = useDebouncedCallback(passphrase => {
		setError(
			liskPassphrase.validation.getPassphraseValidationErrors(
				passphrase,
				undefined,
				passphrase.split(' ').length === 24 ? 24 : 12,
			),
		);
		setIsChecking(false);
	}, 500);

	const onPassphraseChange = React.useCallback(
		e => {
			const inputValue = e.target.value;
			setPassphrase(inputValue);
			setIsChecking(true);

			if (inputValue === '') {
				setError([]);
			} else {
				checkValidPassphrase(inputValue);
			}
		},
		[checkValidPassphrase],
	);

	const onPathChanged = React.useCallback(e => {
		const inputValue = e.target.value;
		setPath(inputValue);
	}, []);

	const onNext = React.useCallback(async () => {
		let privateKey;

		if (isLegacy) {
			privateKey = cryptography.legacy
				.getPrivateAndPublicKeyFromPassphrase(passphrase)
				.privateKey.toString('hex');
		} else {
			privateKey = (
				await cryptography.ed.getPrivateKeyFromPhraseAndPath(passphrase, path)
			).toString('hex');
		}

		storePrivateKey(privateKey);

		if (isSaved) {
			setMode('password');
		} else {
			setSenderPublicKey(
				cryptography.ed.getPublicKeyFromPrivateKey(Buffer.from(privateKey, 'hex')).toString('hex'),
			);
			setMode('normal');
		}
	}, [isLegacy, isSaved, passphrase, path, setMode, setSenderPublicKey, storePrivateKey]);

	return (
		<div className="sc-1kykgp9-2 kqzAOQ">
			<div>
				<div className="sc-1hmbv05-2 ilYVNX">
					<div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
						Please input your 12-word or 24-word passphrase, and key derivation path below
					</div>
				</div>

				<div style={{ height: '32px' }} />

				<TextAreaInput
					placeholder="Passphrase"
					onChange={onPassphraseChange}
					value={passphrase}
					style={{ border: error.length > 0 ? '1px solid var(--red)' : undefined }}
					inputstyle={{
						textWrap: 'wrap',
						overflowY: 'scroll',
						maxHeight: '250px',
						height: '125px',
						fontSize: '16px',
					}}
				/>

				{error.length > 0 && (
					<div
						style={{ display: 'flex', color: 'var(--red)', marginLeft: '16px', marginTop: '8px' }}
					>
						invalid passphrase
						<Tooltip content={error.map(t => t.message).join('; ')}>
							<i
								style={{ margin: '0 4px', color: 'var(--red)' }}
								className="ri-information-line"
							></i>
						</Tooltip>
					</div>
				)}

				<div style={{ height: '12px' }} />

				<RadioButton
					title={'Legacy account'}
					selected={isLegacy}
					onClick={() => setIsLegacy(t => !t)}
				/>

				<div style={{ height: '12px' }} />

				<TextInput
					disabled={isLegacy}
					style={{ opacity: isLegacy ? 0.5 : 1 }}
					inputstyle={{ fontSize: '16px' }}
					fontSize="16px"
					placeholder={'Key derivation path'}
					onChange={onPathChanged}
					value={path}
				/>
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
			<PrimaryButton
				disabled={isChecking || passphrase === '' || error.length > 0}
				style={{ opacity: isChecking || passphrase === '' || error.length > 0 ? 0.5 : 1 }}
				onClick={onNext}
			>
				Import Account
			</PrimaryButton>
		</div>
	);
}
