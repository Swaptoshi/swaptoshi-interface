import React from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import { useWalletConnect } from '../../../../context/WalletConnectProvider';
import { useChain } from '../../../../context/ChainProvider';
import Avatar from '../../../Avatar';
import PrimaryButton from '../../../Button/PrimaryButton';
import { addressCompact } from '../../../../utils/address';
import PasswordInput from '../../../Forms/PasswordInput';
import Loader from '../../../Loader';
import { PASSWORD_REGEX } from '../../../../utils/constants/password';

export default function SetKeyPasswordModal({ setMode }) {
	const { chain } = useChain();
	const { plainPrivateKey, encryptPrivateKey } = useWalletConnect();

	const [isLoading, setIsLoading] = React.useState(false);

	const [password, setPassword] = React.useState('');
	const [isPasswordValid, setIsPasswordValid] = React.useState();

	const [confirmation, setConfirmation] = React.useState('');
	const [isConfirmationValid, setIsConfirmationValid] = React.useState();

	const isValid = React.useMemo(
		() => isPasswordValid === true && isConfirmationValid === true,
		[isConfirmationValid, isPasswordValid],
	);

	const checkPasswordStrength = React.useCallback(inputValue => {
		if (PASSWORD_REGEX.test(inputValue)) {
			setIsPasswordValid(true);
		} else {
			setIsPasswordValid(false);
		}
	}, []);

	const onPasswordChanged = React.useCallback(
		e => {
			const inputValue = e.target.value;
			setPassword(inputValue);
			checkPasswordStrength(inputValue);
		},
		[checkPasswordStrength],
	);

	const checkPasswordMatch = React.useCallback((password, confirmation) => {
		if (password === confirmation) {
			setIsConfirmationValid(true);
		} else {
			setIsConfirmationValid(false);
		}
	}, []);

	const onConfirmationChanged = React.useCallback(
		e => {
			const inputValue = e.target.value;
			setConfirmation(inputValue);
			checkPasswordMatch(password, inputValue);
		},
		[checkPasswordMatch, password],
	);

	const onSetPassword = React.useCallback(async () => {
		setIsLoading(true);
		await new Promise(r => setInterval(r, 100));
		await encryptPrivateKey(password);
		setMode('normal');
	}, [encryptPrivateKey, password, setMode]);

	return plainPrivateKey[chain] ? (
		<div className="sc-1kykgp9-2 kqzAOQ">
			<div>
				<div className="sc-1hmbv05-2 ilYVNX">
					<div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
						Set a password with minimum 8 characters, contains at least: one uppercase letter, one
						lowercase letter, one numeric, and one symbol.
					</div>
				</div>

				<div style={{ height: '32px' }} />

				<div
					style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
				>
					<Avatar
						address={cryptography.address.getLisk32AddressFromAddress(
							cryptography.address.getAddressFromPrivateKey(
								Buffer.from(plainPrivateKey[chain], 'hex'),
							),
						)}
						size={60}
					/>
				</div>

				<div
					style={{
						color: 'var(--text-1)',
						fontSize: '14px',
						width: '100%',
						textAlign: 'center',
						marginTop: '16px',
						wordWrap: 'break-word',
					}}
				>
					{addressCompact(
						cryptography.address.getLisk32AddressFromAddress(
							cryptography.address.getAddressFromPrivateKey(
								Buffer.from(plainPrivateKey[chain], 'hex'),
							),
						),
					)}
				</div>

				<div style={{ height: '32px' }} />

				<PasswordInput
					style={{ border: isPasswordValid === false ? `1px solid var(--red)` : undefined }}
					inputstyle={{ fontSize: '16px' }}
					fontSize="16px"
					placeholder={'Password'}
					onChange={onPasswordChanged}
					value={password}
				/>
				{isPasswordValid === false ? (
					<div
						style={{ color: 'var(--red)', fontSize: '12px', marginLeft: '16px', marginTop: '8px' }}
					>
						Doesn&apos;t meet requirement
					</div>
				) : null}

				<div style={{ height: '16px' }} />

				<PasswordInput
					style={{ border: isConfirmationValid === false ? `1px solid var(--red)` : undefined }}
					inputstyle={{ fontSize: '16px' }}
					fontSize="16px"
					placeholder={'Confirm Password'}
					onChange={onConfirmationChanged}
					value={confirmation}
				/>
				{isConfirmationValid === false ? (
					<div
						style={{ color: 'var(--red)', fontSize: '12px', marginLeft: '16px', marginTop: '8px' }}
					>
						Doesn&apos;t match
					</div>
				) : null}
			</div>
			<div style={{ flex: 1 }} />
			<PrimaryButton
				disabled={!isValid || isLoading}
				onClick={onSetPassword}
				style={{ opacity: isValid ? 1 : 0.5 }}
			>
				{isLoading ? <Loader size={25} /> : 'Set Password'}
			</PrimaryButton>
		</div>
	) : null;
}
