import React from 'react';
import { useTheme } from '../../../context/ThemeProvider';
import SwitchBox from '../../SwitchBox/SwitchBox';

export default function ConfigModal({ onClose, onThemeAuto, onThemeLight, onThemeDark }) {
	const [currentTheme] = useTheme();

	return (
		<div className={`sc-3dvm1v-2 dLsVJq open`}>
			<div className="sc-3dvm1v-0 eTxptr" open="" />
			<div className="sc-3dvm1v-3 hyeENl" open="">
				<div id="wallet-dropdown-scroll-wrapper" className="sc-3dvm1v-1 fijsNj">
					<div className="sc-1kykgp9-0 sc-11yue4p-0 iCxowP kfarYJ">
						<div className="sc-1xe6nb0-0 cnmVKz">
							<div className="sc-1xe6nb0-3 fjOrSN">
								<i className="back-arrow ri-arrow-left-line" onClick={onClose}></i>
								<span className="sc-1xe6nb0-1 UbGpC">
									<div className="sc-sx9n2y-0 kivXvb css-rjqmed">Settings</div>
								</span>
							</div>
							<div className="sc-sx9n2y-0 kivXvb sc-k6pz4u-1 bepFek css-rjqmed">Preferences</div>
							<div className="sc-k6pz4u-2 bqhmxH">
								<div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz1">
									<div width="40%" className="sc-bczRLJ sc-nrd8cx-0 gxbXPT feIyWM">
										<div className="sc-sx9n2y-0 kandXm css-1aekuku">Theme</div>
									</div>
									<SwitchBox
										width="60%"
										value={currentTheme}
										items={[
											{ value: 'system', onClick: onThemeAuto, component: 'Auto' },
											{
												value: 'light',
												onClick: onThemeLight,
												component: <i className="sun ri-sun-line"></i>,
											},
											{
												value: 'dark',
												onClick: onThemeDark,
												component: <i className="moon ri-moon-line"></i>,
											},
										]}
									/>
								</div>
							</div>
							<div
								data-testid="wallet-header"
								className="sc-sx9n2y-0 kivXvb sc-k6pz4u-1 bepFek css-rjqmed"
							>
								Language
							</div>

							<a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=en-US">
								<div data-testid="wallet-language-item" className="sc-sx9n2y-0 kivXvb css-zhpkf8">
									English
								</div>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={20}
									height={20}
									viewBox="0 0 24 24"
									fill="none"
									stroke="#4C82FB"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									opacity={1}
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</a>
							{/* <a
                            className="sc-k6pz4u-0 iFDhEy"
                            href="#/nfts?lng=af-ZA"
                          >
                            <div
                              data-testid="wallet-language-item"
                              className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                            >
                              Afrikaans
                            </div>
                          </a> */}
							<div className="sc-1lgoclx-0 zoyEF">
								<div className="sc-d5tbhs-1 cSretk">
									<a
										target="_blank"
										href={`https://github.com/Swaptoshi/swaptoshi-interface/tree/${process.env.REACT_APP_VERSION.slice(
											0,
											6,
										)}`}
										className="sc-sx9n2y-0 bqwbXT css-zhpkf8"
										rel="noreferrer"
									>
										Version: {process.env.REACT_APP_VERSION.slice(0, 6)}
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
