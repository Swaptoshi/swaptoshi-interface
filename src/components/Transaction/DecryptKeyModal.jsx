import React from 'react';
import * as cryptography from '@liskhq/lisk-cryptography';
import PrimaryButton from '../Button/PrimaryButton';
import Avatar from '../Avatar';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { PASSWORD_REGEX } from '../../utils/constants/password';
import PasswordInput from '../Forms/PasswordInput';
import { toast } from 'react-toastify';
import { useChain } from '../../context/ChainProvider';
import { postTransaction } from '../../service/transaction';

export default function DecryptKeyModal({
	show,
	transaction,
	onClose,
	onFailed,
	onSuccess,
	customSendHandler,
}) {
	const { selectedService } = useChain();
	const { senderPublicKey, sign } = useWalletConnect();

	const [isDecrypting, setIsDecrypting] = React.useState(false);
	const [error, setError] = React.useState();
	const [password, setPassword] = React.useState('');
	const [isPasswordValid, setIsPasswordValid] = React.useState();

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

	const onSend = React.useCallback(
		async transaction => {
			try {
				setIsDecrypting(true);
				setError();

				const signed = await sign(transaction, password);

				if (!signed) {
					throw new Error('Wrong password');
				}

				if (customSendHandler) {
					await customSendHandler(signed);
				} else {
					await postTransaction(signed, selectedService ? selectedService.serviceURLs : undefined);
				}

				onSuccess && onSuccess();
				onClose && onClose();

				toast.success('Transaction submitted');
			} catch (err) {
				onFailed && onFailed(err);
				setError(err.message);
				setIsDecrypting(false);
			}
		},
		[customSendHandler, onClose, onFailed, onSuccess, password, selectedService, sign],
	);

	return (
		<div>
			<div
				className={`sc-jajvtp-0 bmYGet`}
				data-reach-dialog-overlay=""
				style={{ display: show ? 'flex' : 'none' }}
			>
				<div
					aria-modal="true"
					role="dialog"
					tabIndex={-1}
					aria-label="dialog"
					className="sc-jajvtp-1 jBBXQD decrypt-modal"
					data-reach-dialog-content=""
					style={{ maxHeight: undefined, minHeight: 0 }}
				>
					<div className="sc-1kykgp9-0 sc-1it7zu4-0 iCxowP fUHrnW">
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								height: '200px',
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<div
								className="sc-1kykgp9-2 sc-1xp9ndq-0 kqzAOQ eOCLUf"
								style={{
									height: 'unset',
									width: '100%',
									justifyContent: 'flex-end',
									alignItems: 'end',
								}}
							>
								<div
									id="cross-title"
									className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJeh frnZMKK"
									style={{ width: 'unset' }}
								>
									<span onClick={onClose}>
										<i
											className="close-modal ri-close-line hover-shadow"
											style={{ borderRadius: 16, overflow: 'hidden' }}
										></i>
									</span>
								</div>
							</div>

							<Avatar
								address={cryptography.address.getLisk32AddressFromPublicKey(
									Buffer.from(senderPublicKey, 'hex'),
								)}
								size={60}
							/>

							<div
								style={{
									fontWeight: 600,
									fontSize: '24px',
									color: 'var(--color-white)',
									margin: '16px 0',
								}}
							>
								{'Enter Password'}
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									width: '85%',
									borderRadius: '16px',
									padding: '12px 16px',
									fontSize: '14px',
									maxHeight: '230px',
								}}
							>
								<PasswordInput
									style={{
										border: isPasswordValid === false || error ? `1px solid var(--red)` : undefined,
									}}
									inputstyle={{ fontSize: '16px' }}
									fontSize="16px"
									placeholder={'Password'}
									onChange={onPasswordChanged}
									value={password}
								/>
							</div>

							<div style={{ margin: '8px 0' }} />

							<PrimaryButton
								loading={isDecrypting ? 'true' : undefined}
								disabled={!isPasswordValid}
								onClick={() => onSend(transaction)}
								style={{ width: '75%', height: '48px', opacity: !isPasswordValid ? 0.5 : 1 }}
							>
								Submit
							</PrimaryButton>

							{error && (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										marginTop: '16px',
										color: 'var(--red)',
									}}
								>
									<i className="text ri-error-warning-line" style={{ color: 'var(--red)' }}></i>
									<div
										style={{
											color: 'var(--red)',
											fontWeight: 200,
											fontSize: '12px',
											marginLeft: '8px',
										}}
									>
										{error}
									</div>
								</div>
							)}

							<div style={{ marginBottom: '36px' }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
