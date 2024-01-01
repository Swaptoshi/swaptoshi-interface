import React, { useEffect, useState } from 'react';
import './Modal.css';
import { getSystemTheme } from '../../utils/theme/getSystemTheme';
import { useTheme } from '../../context/ThemeProvider';
import { useWalletModal } from '../../context/WalletModalProvider';
import ConfigModal from '../Wallet/Config/ConfigModal';
import WalletModal from '../Wallet/WalletModal';

const Modal = () => {
	const [isModalOpen, setIsModalOpen] = useWalletModal();
	const [currentTheme, setCurrentTheme] = useTheme();

	const [hoverClose, setHoverClose] = useState(true);
	const [isSecondModalOpen, setSecondModalOpen] = useState(false);
	const [theme, setTheme] = useState(currentTheme);

	useEffect(() => {
		currentTheme === 'system' ? setTheme(getSystemTheme()) : setTheme(currentTheme);
	}, [currentTheme]);

	const openConfigHandler = React.useCallback(() => {
		setSecondModalOpen(true);
	}, []);

	const handleSunClick = React.useCallback(() => {
		setCurrentTheme('light');
	}, [setCurrentTheme]);

	const handleMoonClick = React.useCallback(() => {
		setCurrentTheme('dark');
	}, [setCurrentTheme]);

	const handleAutoTheme = React.useCallback(() => {
		setCurrentTheme('system');
	}, [setCurrentTheme]);

	const handleBackButton = React.useCallback(() => {
		setSecondModalOpen(false);
	}, []);

	const handleCloseAccountDrawer = React.useCallback(() => {
		setIsModalOpen(false);
		setSecondModalOpen(false);
	}, [setIsModalOpen]);

	return (
		<>
			<div className={`sc-3dvm1v-2 dLsVJq ${isModalOpen ? 'open' : ''}`}>
				<div
					data-testid="close-account-drawer"
					className={`sc-3dvm1v-5 hVzdzS`}
					style={{
						backgroundColor: hoverClose
							? theme === 'light'
								? '#00000005'
								: '#FFFFFF05'
							: undefined,
					}}
					onMouseEnter={() => setHoverClose(true)}
					onMouseLeave={() => setHoverClose(false)}
					onClick={handleCloseAccountDrawer}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width={24}
						height={24}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						strokeLinecap="round"
						strokeLinejoin="round"
						className="sc-3dvm1v-4 jEKWjE"
					>
						<polyline points="13 17 18 12 13 7" />
						<polyline points="6 17 11 12 6 7" />
					</svg>
				</div>

				<div className={`sc-3dvm1v-0 eTxptr `}></div>
				<div className={`sc-3dvm1v-3 hyeENl`}>
					<div id="wallet-dropdown-scroll-wrapper" className="sc-3dvm1v-1 fijsNj">
						<div className="sc-1kykgp9-0 sc-11yue4p-0 iCxowP kfarYJ">
							<WalletModal
								show={isModalOpen}
								onConfigClick={openConfigHandler}
								closeHandler={handleCloseAccountDrawer}
								theme={theme}
							/>

							{isSecondModalOpen && (
								<ConfigModal
									onClose={handleBackButton}
									onThemeAuto={handleAutoTheme}
									onThemeLight={handleSunClick}
									onThemeDark={handleMoonClick}
								/>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Modal;
