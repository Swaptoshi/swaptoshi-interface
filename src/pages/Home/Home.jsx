/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import './Home.css';
import Footer from '../../components/Footer/Footer';
import { NavLink } from 'react-router-dom';
import SwapWidget from '../../components/Swap/SwapWidget';
import { useChain } from '../../context/ChainProvider';

const Home = () => {
	const { lskTokenInfo } = useChain();
	const sectionRef = React.useRef(null);

	const handleClick = () => {
		const headerHeight = 72;
		const element = sectionRef.current;

		if (element) {
			const rect = element.getBoundingClientRect();
			const scrollPosition = window.scrollY + rect.top - headerHeight;

			window.scrollTo({
				top: scrollPosition,
				behavior: 'smooth',
			});
		}
	};

	return (
		<React.Fragment>
			<div className="home-page">
				{/* <div className='swap-card'> */}
				<div className="card-wrapper">
					<NavLink className="card-anchor" to="/swap">
						<div className="card-section card-home">
							<div className={'card-home-bg'} style={{ borderRadius: '24px' }}>
								<SwapWidget disabled initialBaseToken={lskTokenInfo} />
							</div>
						</div>
					</NavLink>
				</div>

				<div className="backdrop"></div>
				<div className="shade-parent">
					<div className="shade"></div>
				</div>

				<div className="hero-content-wrapper">
					<h1 className="hero-title">Trade Tremendous New Opportunities</h1>
					<div className="hero-text">
						<p>Swaptoshi is a Fair-Launched Community-Driven Lisk DEX</p>
					</div>
					<span className="get-started-wrapper">
						<NavLink to={'/swap'} id="getStartedBtnId" className="get-started-btn get-btn">
							<p className="get-started-text">Get Started</p>
						</NavLink>
					</span>
					<div className="learn-more" onClick={handleClick}>
						Learn more
						<i className="learn-more-icon ri-arrow-down-line"></i>
					</div>

					<a href="https://lisk.chat" className="download-app" target="_blank" rel="noreferrer">
						<i className="discord-icon ri-discord-fill"></i>
						Join Lisk Discord Server!
					</a>
				</div>

				{/* Cards Section */}
				<section className="container-cards" ref={sectionRef}>
					<div className="col-2 container-wrapper">
						{/* Card One */}
						<a className="swap-tokens-card card-one" href="#/swap">
							<div className="trade-title">
								<p className="">Swap Tokens</p>
							</div>
							<div className="c-container-bottom">
								Dive into the dynamic universe of Swaptoshi! Buy, sell, and explore tokens on our
								interconnected network.
								<div id="cContainerLink" className="c-container-link">
									Trade Tokens
								</div>
							</div>
						</a>

						{/* Card Two */}
						<a className="swap-tokens-card card-two" href="#/ntfs">
							<div className="trade-title">
								<p className="">Create Tokens</p>
							</div>
							<div className="c-container-bottom">
								Effortlessly generate tokens that seamlessly interact with others— no-code, no
								node-setup, and absolutely no hassle!
								<div id="cContainerLink" className="c-container-link">
									Create Tokens
								</div>
							</div>
						</a>
					</div>

					<div className="col-3 small-container-wrapper">
						<a className="">
							<div className="crypto-guide c-one">
								<p>New Opportunities</p>
								<img className="" src="/assets/images/dollar-image.png" alt="Earn" />
							</div>
							<div className="guide-text">
								Generate tokens, set up pools, and unlock new opportunities within the Swaptoshi
								network.
								<div id="btnLink" className="button-link">
									Explore more
								</div>
							</div>
						</a>

						<a
							className=""
							href="https://support.uniswap.org/hc/en-us/articles/11306574799117-How-to-use-Moon-Pay-on-the-Uniswap-web-app-"
						>
							<div className="crypto-guide c-two">
								<p>Earn</p>
								<img className="" src="/assets/images/earn-image.png" alt="Earn" />
							</div>
							<div className="guide-text">
								Provide liquidity to pools on Swaptoshi and earn fees on swaps.
								<div id="btnLink" className="button-link">
									Provide liquidity
								</div>
							</div>
						</a>
						<a
							className=""
							href={`https://petstore.swagger.io/?url=${process.env.REACT_APP_LISK_SERVICE_URL}/api/v3/spec`}
						>
							<div className="crypto-guide c-three">
								<p>Build dApps</p>
								<img className="" src="/assets/images/build-dapps-image.png" alt="Earn" />
							</div>
							<div className="guide-text">
								Discover the possibilities with Swaptoshi developer API and craft your own
								incredible use cases.
								<div id="btnLink" className="button-link">
									API Documentation
								</div>
							</div>
						</a>
					</div>

					<div className="protocol-card">
						<div className="protocol-left">
							<span className="protocol-title">Powered by the Swaptoshi Protocol</span>
							<p className="protocol-text">
								{"SWT, with a 21 million supply, powers Swaptoshi Protocol's fees and governance."}
							</p>
						</div>
						<div className="protocol-right">
							<div style={{ width: 100 }} />
							{/* <a
								disabled
								id="learnMoreBtn"
								className="learn-more-btn lmb"
								href="https://swaptoshi.io/"
							>
								Learn more
							</a> */}
						</div>
					</div>

					<Footer />
				</section>
			</div>
		</React.Fragment>
	);
};

export default Home;
