import React from 'react';
import PrimaryButton from '../Button/PrimaryButton';
import SwitchBox from '../SwitchBox/SwitchBox';

export default function TransactionModal({ show, onClose }) {
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
										value={'summary'}
										items={[
											{ value: 'summary', component: <i className="text ri-pencil-line"></i> },
											{ value: 'json', component: <i className="text ri-code-box-line"></i> },
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
								}}
							>
								<div
									style={{ display: 'flex', alignItems: 'center', margin: '12px 0', width: '100%' }}
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
									<div className="text">dex</div>
								</div>

								<div
									style={{ display: 'flex', alignItems: 'center', margin: '12px 0', width: '100%' }}
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
									<div className="text">dex</div>
								</div>

								<div
									style={{ display: 'flex', alignItems: 'center', margin: '12px 0', width: '100%' }}
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
									<div className="text">dex</div>
								</div>
							</div>

							<div style={{ margin: '8px 0' }} />

							<PrimaryButton style={{ width: '75%', height: '48px' }}>Send</PrimaryButton>

							<div style={{ marginBottom: '36px' }} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
