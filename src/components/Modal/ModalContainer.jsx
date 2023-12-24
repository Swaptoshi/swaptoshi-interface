import React from 'react';
import './ModaContainer.css';
import { NavLink } from 'react-router-dom';

export default function ModalContainer({ children, title, backTo, topRightComponent }) {
	return (
		<div className="App__BodyWrapper-sc-7e45ae4f-0 clIMsa">
			<div className="styled__ScrollablePage-sc-a3e32a7b-1 kVNjZg">
				<main
					className={`AppBody_BodyWrapper-sc-19e20e47-0 AddLiquidity_StyledBodyWrapper-sc-91848848-0 GfTH FuZnx-expanded`}
				>
					<div className="NavigationTabs__Tabs-sc-b4540a6e-0 kmmojd">
						<div
							className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr"
							style={{ padding: '1rem 1rem 0px' }}
						>
							<NavLink
								flex={1}
								className="NavigationTabs__StyledLink-sc-b4540a6e-1 dIAqzj"
								to={backTo}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={24}
									height={24}
									viewBox="0 0 24 24"
									fill="none"
									stroke="#98A1C0"
									strokeWidth={2}
									strokeLinecap="round"
									strokeLinejoin="round"
									className="NavigationTabs__StyledArrowLeft-sc-b4540a6e-3 jpkEeW"
								>
									<line x1={19} y1={12} x2={5} y2={12} />
									<polyline points="12 19 5 12 12 5" />
								</svg>
							</NavLink>
							<div className="text__TextWrapper-sc-9327e48a-0 blhgKn NavigationTabs__AddRemoveTitleText-sc-b4540a6e-4 cMHLWt css-12uvan3">
								{title}
							</div>
							<div className="css-vurnku" style={{ marginRight: '0.5rem' }}>
								<div
									className="sc-bczRLJ Row-sc-34df4f97-0 fgCeff gOYHMo"
									style={{ width: 'fit-content', minWidth: 'fit-content' }}
								>
									<div
										className="styled__MediumOnly-sc-a3e32a7b-6 cYrhOe"
										style={{
											minWidth: '100px',
											minHeight: '50px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										{topRightComponent}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="styled__Wrapper-sc-a3e32a7b-0 vSeCC">
						<div className="styled__ResponsiveTwoColumns-sc-a3e32a7b-5 dXokMm">
							<div className="Column__AutoColumn-sc-72c388fb-2 ereGUg">{children}</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
