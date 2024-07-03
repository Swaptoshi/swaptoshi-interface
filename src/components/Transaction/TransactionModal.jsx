import React from 'react';
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import PrimaryButton from '../Button/PrimaryButton';
import SwitchBox from '../SwitchBox/SwitchBox';
import { useTheme } from '../../context/ThemeProvider';
import { getSystemTheme } from '../../utils/theme/getSystemTheme';
import { useDebouncedCallback } from 'use-debounce';
import { dryRunTransaction, postTransaction } from '../../service/transaction';
import { useChain } from '../../context/ChainProvider';
import Loader from '../Loader';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import { toast } from 'react-toastify';
import { tryToast } from '../../utils/toast/tryToast';
import { getBaseFee } from '../../utils/transaction/fee';
import * as env from '../../utils/config/env';
import { useTransactionModal } from '../../context/TransactionModalProvider';
import { getTransactionBytes } from '../../utils/transaction/bytes';

const jsonTheme = {
	light: defaultStyles,
	dark: darkStyles,
};

export default function TransactionModal({
	show,
	transaction,
	onClose,
	onFailed,
	onSuccess,
	customSendHandler,
}) {
	const [theme] = useTheme();
	const { selectedService, chain, feeConfig } = useChain();
	const { sign, encryptedPrivateKey } = useWalletConnect();
	const { showDecryptModal } = useTransactionModal();

	const [isSending, setIsSending] = React.useState(false);
	const [ready, setReady] = React.useState(false);
	const [status, setStatus] = React.useState('Intializing transaction...');
	const [error, setError] = React.useState();
	const [parsedTransaction, setParsedTransaction] = React.useState();
	const [isFetching, setIsFecting] = React.useState(true);
	const [mode, setMode] = React.useState('summary');

	const onSend = React.useCallback(
		async tx => {
			if (encryptedPrivateKey[chain]) {
				showDecryptModal({
					transaction: tx,
					onClose,
					onSuccess,
					onFailed,
					customHandler: customSendHandler,
				});
				return;
			}

			await tryToast(
				'Submit transaction failed',
				async () => {
					setStatus('Sending transaction, please proceed in your Klayr Wallet...');
					setIsSending(true);

					const signed = await sign(tx);

					if (!signed) {
						throw new Error('Sign transaction failed');
					}

					if (customSendHandler) {
						await customSendHandler(signed);
					} else {
						await postTransaction(
							signed,
							selectedService ? selectedService.serviceURLs : undefined,
						);
					}

					onSuccess && onSuccess();
					toast.success('Transaction submitted');
				},
				err => {
					onFailed && onFailed(err);
				},
				() => {
					onClose && onClose();
				},
			);
		},
		[
			chain,
			customSendHandler,
			encryptedPrivateKey,
			onClose,
			onFailed,
			onSuccess,
			selectedService,
			showDecryptModal,
			sign,
		],
	);

	const dryRun = React.useCallback(
		async transaction => {
			const errorMessage = 'Dry run transaction failed, please re-check your parameter';
			try {
				setStatus('Dry running transaction...');
				const run = await dryRunTransaction(
					{ ...transaction, id: '0'.repeat(64) },
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (run && run.data) {
					if (run.data.result === -1) {
						if (env.NODE_ENV === 'development') console.error('Dry Run Result:', run.data);
						throw new Error(run.data.errorMessage);
					}
					if (run.data.result === 0) {
						if (env.NODE_ENV === 'development') console.error('Dry Run Result:', run.data);
						throw new Error(errorMessage);
					}
					setReady(true);
					setIsFecting(false);
					setStatus('Valid transaction!');
				}
			} catch (err) {
				setError(err.message ? err.message : errorMessage);
				setIsFecting(false);
			}
		},
		[selectedService],
	);

	const calculateMinimumFee = useDebouncedCallback(async transaction => {
		try {
			setStatus('Calculating transacton fee...');
			const txBytes = await getTransactionBytes(transaction);
			const minFee = BigInt(txBytes.length) * BigInt(feeConfig.minFeePerByte);

			let fee = minFee + BigInt(getBaseFee(transaction.module, transaction.command));
			const parsed = {
				...transaction,
				fee: fee.toString(),
				signatures: [],
			};
			setParsedTransaction(parsed);
			dryRun(parsed);
		} catch (err) {
			setError(err.message);
			setIsFecting(false);
		}
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		calculateMinimumFee(transaction);
	}, [calculateMinimumFee, transaction, selectedService]);

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
					className="sc-jajvtp-1 jBBXQD review-transaction"
					data-reach-dialog-content=""
					style={{ maxHeight: undefined, minHeight: 0 }}
				>
					<div className="sc-1kykgp9-0 sc-1it7zu4-0 iCxowP fUHrnW">
						<div className="sc-1kykgp9-2 sc-1xp9ndq-0 kqzAOQ eOCLUf" style={{ height: 'unset' }}>
							<div
								id="cross-title"
								className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJeh frnZMKK"
								style={{ marginBottom: '8px' }}
							>
								<div style={{ width: '30%' }}>
									<SwitchBox
										style={{ width: '100%' }}
										value={mode}
										items={[
											{
												value: 'summary',
												component: <i className="text ri-information-line"></i>,
												onClick: () => setMode('summary'),
											},
											{
												value: 'json',
												component: <i className="text ri-code-box-line"></i>,
												onClick: () => setMode('json'),
											},
										]}
									/>
								</div>
								<span onClick={onClose}>
									<i
										className="close-modal ri-close-line hover-shadow"
										style={{ borderRadius: 16, overflow: 'hidden' }}
									></i>
								</span>
							</div>
						</div>

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
								style={{
									borderRadius: '96px',
									width: '120px',
									height: '120px',
									backgroundColor: 'var(--surface-2)',
									padding: '24px',
									overflow: 'hidden',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<i
									className={isSending ? 'ri-mail-send-line' : 'ri-mail-line'}
									style={{
										fontSize: '60px',
										color: 'var(--text-3)',
									}}
								></i>
							</div>

							<div
								style={{
									fontWeight: 600,
									fontSize: '24px',
									color: 'var(--text-1)',
									margin: '16px 0',
								}}
							>
								{isSending ? 'Sending Transaction' : 'Review Transaction'}
							</div>

							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									width: '85%',
									border: '1px solid var(--border)',
									borderRadius: '16px',
									padding: '12px 16px',
									fontSize: '14px',
									maxHeight: '230px',
								}}
							>
								{mode === 'json' ? (
									<div style={{ height: '100%', overflow: 'scroll' }}>
										<JsonView
											data={parsedTransaction}
											shouldExpandNode={allExpanded}
											style={theme === 'system' ? jsonTheme[getSystemTheme()] : jsonTheme[theme]}
										/>
									</div>
								) : isFetching || !parsedTransaction ? (
									<div
										className="text"
										style={{
											height: '110px',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										{error ? "Something's not right, try again later" : <Loader size={10} />}
									</div>
								) : (
									<div>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												margin: '12px 0',
												width: '100%',
											}}
										>
											<div
												className="text"
												style={{
													width: 'fit-content',
													flex: 1,
													color: 'var(--text-3)',
													display: 'flex',
													alignItems: 'center',
												}}
											>
												Module
											</div>
											<div className="text">{parsedTransaction.module}</div>
										</div>

										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												margin: '12px 0',
												width: '100%',
											}}
										>
											<div
												className="text"
												style={{
													width: 'fit-content',
													flex: 1,
													color: 'var(--text-3)',
													display: 'flex',
													alignItems: 'center',
												}}
											>
												Command
											</div>
											<div className="text">{parsedTransaction.command}</div>
										</div>

										<div
											style={{
												display: 'flex',
												alignItems: 'center',
												margin: '12px 0',
												width: '100%',
											}}
										>
											<div
												className="text"
												style={{
													width: 'fit-content',
													flex: 1,
													color: 'var(--text-3)',
													display: 'flex',
													alignItems: 'center',
												}}
											>
												Fee
											</div>
											<div className="text">
												{Number(parsedTransaction.fee) / 10 ** env.DEFAULT_TOKEN_DECIMAL}{' '}
												{env.WC_TOKEN_SYMBOL}
											</div>
										</div>
									</div>
								)}
							</div>

							<div style={{ margin: '8px 0' }} />

							<PrimaryButton
								loading={isSending ? 'true' : undefined}
								disabled={!ready}
								onClick={() => onSend(parsedTransaction)}
								style={{ width: '75%', height: '48px', opacity: !ready ? 0.5 : 1 }}
							>
								Sign And Send
							</PrimaryButton>

							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: '16px',
								}}
							>
								{error ? (
									<i className="text ri-error-warning-line"></i>
								) : isFetching || isSending ? (
									<Loader size={15} />
								) : (
									<i className="text ri-checkbox-circle-line"></i>
								)}
								<div
									style={{
										color: 'var(--text-1)',
										fontWeight: 200,
										fontSize: '12px',
										marginLeft: '8px',
									}}
								>
									{error ? error : status}
								</div>
							</div>

							<div style={{ marginBottom: '36px' }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
