import React from 'react';
import { Buffer } from 'buffer';
import * as cryptography from '@klayr/cryptography';
import { useWalletConnect } from '../../context/WalletConnectProvider';
import CopyToClipboard from 'react-copy-to-clipboard';
import Avatar from '../Avatar';
import { addressCompact } from '../../utils/address';
import Loader from '../Loader';
import { useTheme } from '../../context/ThemeProvider';
import { useWalletModal } from '../../context/WalletModalProvider';

export default function WalletModalHeader({ onConfigClick, closeHandler, mode, setMode }) {
	const { senderPublicKey, disconnect } = useWalletConnect();
	const [, setIsModalOpen] = useWalletModal();
	const [currentTheme] = useTheme();

	const [addressCopied, setAddressRequestCopied] = React.useState(false);
	const [hoverAddress, setHoverAddress] = React.useState(false);
	const [isDisconnecting, setIsDisconnecting] = React.useState(false);

	const handleAddressCopied = React.useCallback(() => {
		setAddressRequestCopied(true);
		setTimeout(() => setAddressRequestCopied(false), 1000);
	}, []);

	const handleDisconnect = React.useCallback(async () => {
		setIsDisconnecting(true);
		await disconnect();
		closeHandler();
		setIsDisconnecting(false);
	}, [disconnect, closeHandler]);

	return (
		<div width="100%" className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 laNPNA fsgYBU">
			{senderPublicKey ? (
				<CopyToClipboard
					text={cryptography.address.getKlayr32AddressFromPublicKey(
						Buffer.from(senderPublicKey, 'hex'),
					)}
					onCopy={handleAddressCopied}
					onMouseEnter={() => setHoverAddress(true)}
					onMouseLeave={() => setHoverAddress(false)}
				>
					<div style={{ display: 'flex', cursor: 'pointer' }}>
						<Avatar
							size={30}
							address={cryptography.address.getKlayr32AddressFromPublicKey(
								Buffer.from(senderPublicKey, 'hex'),
							)}
						/>
						<p
							className="text"
							style={{
								marginTop: 'auto',
								marginBottom: 'auto',
								marginLeft: '8px',
								fontSize: '12px',
							}}
						>
							{addressCompact(
								cryptography.address.getKlayr32AddressFromPublicKey(
									Buffer.from(senderPublicKey, 'hex'),
								),
							)}
						</p>
						{hoverAddress ? (
							<div
								style={{
									marginTop: 'auto',
									marginBottom: 'auto',
									marginLeft: '8px',
								}}
							>
								{addressCopied ? (
									<svg
										width="14px"
										height="14px"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										style={{ color: 'var(--text-1)' }}
									>
										<path
											fill="currentColor"
											fillRule="evenodd"
											d="M3 10a7 7 0 019.307-6.611 1 1 0 00.658-1.889 9 9 0 105.98 7.501 1 1 0 00-1.988.22A7 7 0 113 10zm14.75-5.338a1 1 0 00-1.5-1.324l-6.435 7.28-3.183-2.593a1 1 0 00-1.264 1.55l3.929 3.2a1 1 0 001.38-.113l7.072-8z"
										/>
									</svg>
								) : (
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<g clipPath="url(#clip0_5_1870)">
											<path
												d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z"
												stroke="currentColor"
												style={{ color: 'var(--text-1)' }}
												strokeWidth="1.3"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
											<path
												d="M3.33398 10.0007H2.66732C2.3137 10.0007 1.97456 9.86017 1.72451 9.61013C1.47446 9.36008 1.33398 9.02094 1.33398 8.66732V2.66732C1.33398 2.3137 1.47446 1.97456 1.72451 1.72451C1.97456 1.47446 2.3137 1.33398 2.66732 1.33398H8.66732C9.02094 1.33398 9.36008 1.47446 9.61013 1.72451C9.86017 1.97456 10.0007 2.3137 10.0007 2.66732V3.33398"
												stroke="currentColor"
												style={{ color: 'var(--text-1)' }}
												strokeWidth="1.3"
												strokeLinecap="round"
												strokeLinejoin="round"
											></path>
										</g>
										<defs>
											<clipPath id="clip0_5_1870">
												<rect width="16" height="16" fill="white"></rect>
											</clipPath>
										</defs>
									</svg>
								)}
							</div>
						) : null}
					</div>
				</CopyToClipboard>
			) : (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					{['key', 'import', 'create'].includes(mode) ? (
						<i
							className="back-arrow ri-arrow-left-line"
							onClick={() => setMode(mode === 'key' ? 'normal' : 'key')}
							style={{ marginRight: '16px', color: 'var(--text-1)' }}
						/>
					) : null}
					<div className="sc-sx9n2y-0 kivXvb css-rjqmed">
						{mode === 'normal'
							? 'Connect a wallet'
							: mode === 'key'
								? 'Connect a key'
								: mode === 'import'
									? 'Import phrase'
									: mode === 'create'
										? 'Create new account'
										: mode === 'password'
											? 'Set local key password'
											: 'Unknown mode'}
					</div>
				</div>
			)}
			<div style={{ display: 'flex' }}>
				<button
					data-testid="wallet-settings"
					className="sc-u2uow0-2 kIafUC"
					onClick={onConfigClick}
				>
					<span className="sc-u2uow0-3 bLwPSk">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width={16}
							height={16}
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<circle cx={12} cy={12} r={3} />
							<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
						</svg>
					</span>
				</button>
				{senderPublicKey ? (
					<button
						data-testid="disconnect"
						className="sc-u2uow0-2 kIafUC"
						onClick={handleDisconnect}
						style={{ marginLeft: '8px' }}
					>
						<span className="sc-u2uow0-3 bLwPSk">
							{isDisconnecting ? (
								<Loader size={14} theme={currentTheme} />
							) : (
								<svg
									width="14px"
									height="14px"
									viewBox="0 -0.5 21 21"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
								>
									<g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
										<g
											id="Dribbble-Light-Preview"
											transform="translate(-419.000000, -560.000000)"
											fill="currentColor"
										>
											<g id="icons" transform="translate(56.000000, 160.000000)">
												<path
													d="M378.381271,401.145 C377.596921,400.752 376.64982,401.278 376.64982,402.123 C376.64982,402.552 376.91862,402.925 377.316571,403.126 C380.236622,404.602 382.110873,407.716 381.575372,411.174 C381.046172,414.602 378.050521,417.343 374.434319,417.728 C369.515067,418.251 365.333966,414.581 365.333966,410 C365.333966,407.004 367.121066,404.4 369.733467,403.101 C370.102018,402.918 370.349818,402.572 370.349818,402.176 L370.349818,402.084 C370.349818,401.256 369.423717,400.745 368.651967,401.129 C364.951765,402.966 362.545164,406.841 363.072265,411.191 C363.624565,415.742 367.515866,419.43 372.296519,419.936 C378.634321,420.607 383.999823,415.9 383.999823,410 C383.999823,406.155 381.722372,402.818 378.381271,401.145 M372.449819,409 L372.449819,401 C372.449819,400.447 372.920219,400 373.499819,400 C374.080469,400 374.549819,400.447 374.549819,401 L374.549819,409 C374.549819,409.552 374.080469,410 373.499819,410 C372.920219,410 372.449819,409.552 372.449819,409"
													id="shut_down-[#1431]"
												></path>
											</g>
										</g>
									</g>
								</svg>
							)}
						</span>
					</button>
				) : null}
				<button
					data-testid="wallet-settings"
					className="sc-u2uow0-2 kIafUC close-modal-button"
					style={{ marginLeft: '8px' }}
					onClick={() => setIsModalOpen(false)}
				>
					<span className="sc-u2uow0-3 bLwPSk">
						<i className="ri-close-circle-line"></i>
					</span>
				</button>
			</div>
		</div>
	);
}
