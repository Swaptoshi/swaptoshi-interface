import React from 'react';
import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import PrimaryButton from '../Button/PrimaryButton';
import SwitchBox from '../SwitchBox/SwitchBox';
import { useTheme } from '../../context/ThemeProvider';
import { getSystemTheme } from '../../utils/Theme/getSystemTheme';
import { useDebouncedCallback } from 'use-debounce';
import { getTransactionEstimateFee } from '../../service/transaction';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/Toast/tryToast';
import Loader from '../Loader';

const jsonTheme = {
	light: defaultStyles,
	dark: darkStyles,
};

export default function TransactionModal({ show, transaction, onClose }) {
	const [theme] = useTheme();
	const { selectedService } = useChain();

	const [parsedTransaction, setParsedTransaction] = React.useState();
	const [isFetching, setIsFecting] = React.useState(true);
	const [mode, setMode] = React.useState('summary');

	const calculateMinimumFee = useDebouncedCallback(async transaction => {
		tryToast(
			'Fetch transaction info failed',
			async () => {
				const estimatedFee = await getTransactionEstimateFee(
					transaction,
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (estimatedFee && estimatedFee.data) {
					setParsedTransaction({
						...transaction,
						fee: estimatedFee.data.transaction.fee.minimum,
						signatures: [],
					});
					setIsFecting(false);
				}
			},
			() => onClose && onClose(),
		);
	}, 500);

	React.useEffect(() => {
		calculateMinimumFee(transaction);
	}, [calculateMinimumFee, transaction]);

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
					className="sc-jajvtp-1 jBBXQD"
					data-reach-dialog-content=""
					style={{ maxHeight: undefined, minHeight: 0 }}
				>
					<div className="sc-1kykgp9-0 sc-1it7zu4-0 iCxowP fUHrnW">
						<div className="sc-1kykgp9-2 sc-1xp9ndq-0 kqzAOQ eOCLUf">
							<div
								id="cross-title"
								className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJeh frnZMKK"
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
									backgroundColor: 'var(--card-inside-color)',
									padding: '24px',
									overflow: 'hidden',
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<i
									className="ri-mail-send-line"
									style={{
										fontSize: '60px',
										color: 'var(--text-clr)',
									}}
								></i>
							</div>

							<div
								style={{
									fontWeight: 600,
									fontSize: '24px',
									color: 'var(--color-white)',
									margin: '16px 0',
								}}
							>
								Review Transaction
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
								) : isFetching ? (
									<div
										style={{
											height: '110px',
											display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
										}}
									>
										<Loader size={10} />{' '}
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
													color: 'var(--text-color)',
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
													color: 'var(--text-color)',
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
													color: 'var(--text-color)',
													display: 'flex',
													alignItems: 'center',
												}}
											>
												Fee
											</div>
											<div className="text">
												{Number(parsedTransaction.fee) /
													10 ** process.env.REACT_APP_DEFAULT_TOKEN_DECIMAL}{' '}
												{process.env.REACT_APP_WC_TOKEN_SYMBOL}
											</div>
										</div>
									</div>
								)}
							</div>

							<div style={{ margin: '8px 0' }} />

							<PrimaryButton style={{ width: '75%', height: '48px' }}>Sign And Send</PrimaryButton>

							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: '16px',
								}}
							>
								<Loader size={15} />
								<div
									style={{
										color: 'var(--color-white)',
										fontWeight: 200,
										fontSize: '12px',
										marginLeft: '8px',
									}}
								>
									Dry running transaction
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
