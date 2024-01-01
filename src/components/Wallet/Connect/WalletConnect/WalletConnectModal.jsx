import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import QRCode from 'react-qr-code';
import Loader from '../../../Loader';
import { useTheme } from '../../../../context/ThemeProvider';
import { useWalletConnect } from '../../../../context/WalletConnectProvider';
import TertiaryButton from '../../../Button/TertiaryButton';

export default function WalletConnectModal({ setMode }) {
	const [currentTheme] = useTheme();
	const { wcUri } = useWalletConnect();

	const [wcCopied, setWCRequestCopied] = React.useState(false);

	const handleWCRequestCopied = React.useCallback(() => {
		setWCRequestCopied(true);
		setTimeout(() => setWCRequestCopied(false), 2000);
	}, []);

	return (
		<div className="sc-1kykgp9-2 kqzAOQ">
			<div>
				<div className="sc-1hmbv05-2 ilYVNX">
					<div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
						Scan the QR code using{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://lisk.com/wallet"
							className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
						>
							Lisk Mobile{' '}
						</a>{' '}
						or copy the request string and paste it into your{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="lisk://"
							className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
						>
							Lisk Desktop{' '}
						</a>{' '}
						wallet (under Applications {'>'} Wallet connections {'>'}
						Connect Wallet)
					</div>
				</div>

				<div style={{ height: '16px' }} />

				<div data-testid="option-grid" className="sc-1hmbv05-1 hmenal">
					<div
						style={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{wcUri ? (
							<div>
								<div
									style={{
										background: 'white',
										padding: '8px',
									}}
								>
									<QRCode value={wcUri} style={{ width: '100%' }} />
								</div>

								<div style={{ height: '16px' }} />

								<CopyToClipboard text={wcUri} onCopy={handleWCRequestCopied}>
									{wcCopied ? (
										<div
											className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
											<p
												style={{
													marginTop: 'auto',
													marginBottom: 'auto',
													fontSize: '14px',
												}}
											>
												Request Copied
											</p>
										</div>
									) : (
										<div
											className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
											style={{
												display: 'flex',
												justifyContent: 'center',
												alignItems: 'center',
											}}
										>
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
														strokeWidth="1.3"
														strokeLinecap="round"
														strokeLinejoin="round"
													></path>
													<path
														d="M3.33398 10.0007H2.66732C2.3137 10.0007 1.97456 9.86017 1.72451 9.61013C1.47446 9.36008 1.33398 9.02094 1.33398 8.66732V2.66732C1.33398 2.3137 1.47446 1.97456 1.72451 1.72451C1.97456 1.47446 2.3137 1.33398 2.66732 1.33398H8.66732C9.02094 1.33398 9.36008 1.47446 9.61013 1.72451C9.86017 1.97456 10.0007 2.3137 10.0007 2.66732V3.33398"
														stroke="currentColor"
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
											<p
												style={{
													marginTop: 'auto',
													marginBottom: 'auto',
													marginLeft: '8px',
													fontSize: '14px',
												}}
											>
												Copy Request
											</p>
										</div>
									)}
								</CopyToClipboard>

								<div style={{ height: '24px' }} />

								<div
									className="sc-sx9n2y-0 bftkTM css-4u0e4f"
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Loader size={18} theme={currentTheme} />
									<p
										style={{
											marginTop: 'auto',
											marginBottom: 'auto',
											marginLeft: '8px',
											fontSize: '14px',
										}}
									>
										Awaiting Connection...
									</p>
								</div>
							</div>
						) : (
							<Loader size={40} theme={currentTheme} />
						)}
					</div>
				</div>
				{/* <div className="sc-1hmbv05-2 ilYVNX">
					<div className="sc-sx9n2y-0 bftkTM css-4u0e4f">
						By connecting a wallet, you agree to Swaptoshi Labs'{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://uniswap.org/terms-of-service/"
							className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
						>
							Terms of Service{' '}
						</a>
						and consent to its{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://uniswap.org/privacy-policy"
							className="sc-7yzmni-9 jnMVFjj sc-m8pibl-0 eBkKRJ"
						>
							Privacy Policy.
						</a>
						<span className="sc-m8pibl-1 hqtSjX"> (Last Updated 6.7.23)</span>
					</div>
				</div> */}
			</div>
			<div style={{ flex: 1 }} />
			<div>
				<TertiaryButton onClick={() => setMode('key')} style={{ width: '100%' }}>
					Having trouble connecting?
				</TertiaryButton>
			</div>
		</div>
	);
}
