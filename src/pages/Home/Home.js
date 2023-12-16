/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";

import "./Home.css";
import Footer from "../../components/Footer/Footer";
import { NavLink } from "react-router-dom";

const Home = () => {
  const sectionRef = React.useRef(null);

  const handleClick = () => {
    const headerHeight = 72;
    const element = sectionRef.current;

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollPosition = window.scrollY + rect.top - headerHeight;

      window.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <React.Fragment>
      <div className="home-page">
        {/* <div className='swap-card'> */}
        <div className="card-wrapper">
          <a className="card-anchor" href="/swap">
            <div className="card-section">
              <main className="card-home-bg">
                <div id="card-home-top" className="card-top-parent">
                  <div id="btns-top" className="top-btns">
                    <span className="swap-btn">Swap</span>
                    <div className="buy">
                      <button id="btn-id" className="buy-btn">
                        Buy
                      </button>
                    </div>
                  </div>

                  <div className="gear">
                    <button className="gear-btn">
                      <div>
                        <i className="ri-settings-3-fill gear-icon"></i>
                      </div>
                    </button>
                  </div>
                </div>

                {/* You Pay Tab */}
                <div>
                  <div className="you-pay">
                    <div id="swap-currency-input" className="swap-currency">
                      <div className="input-wrapper">
                        <label className="youPay-label">You pay</label>
                        <div className="paying-wrapper">
                          <input
                            id="token-amount"
                            className="token-amount-input token-home"
                            inputMode="numeric"
                            autoComplete="off"
                            autoCorrect="off"
                            type="text"
                            name="you-pay"
                            placeholder="0"
                            minlength="1"
                            maxlength="79"
                            spellcheck="false"
                            value=""
                          />

                          <div>
                            <button
                              id="open-currency-select"
                              className="open-currency-btn-top"
                            >
                              <span className="span-one">
                                <div className="cryptocurrency-wrapper">
                                  <div className="image-wrapper ">
                                    <div>
                                      <img
                                        className="icon-image"
                                        src="./assets/images/tokens/eth-icon.png"
                                        alt="eth-icon"
                                      />
                                    </div>
                                  </div>
                                  <span className="token-name">ETH</span>
                                </div>
                                <div className="dropdown-icon">
                                  <i className="ri-arrow-down-s-line"></i>{" "}
                                </div>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="switch-button">
                    <div className="switch-bg">
                      <i className="arrow-down ri-arrow-down-line"></i>
                    </div>
                  </div>

                  <div className="grid">
                    <div className="you-receive">
                      <div id="swap-currency-input" className="swap-currency">
                        <div className="input-wrapper">
                          <label className="youPay-label">You receive</label>
                          <div className="paying-wrapper">
                            <input
                              id="token-amount"
                              className="token-amount-input token-home"
                              inputMode="numeric"
                              autoComplete="off"
                              autoCorrect="off"
                              name="you-receive"
                              type="text"
                              placeholder="0"
                              minlength="1"
                              maxlength="79"
                              spellcheck="false"
                              value=""
                            />

                            <div>
                              <button
                                id="open-currency-select"
                                className="open-currency-btn-bottom"
                              >
                                <span className="span-two">
                                  <div className="cryptocurrency-wrapper">
                                    <div className="text-wrapper">
                                      <span className="select-token">
                                        Select token
                                      </span>
                                    </div>
                                  </div>
                                  <div className="dropdown-icon">
                                    <i className="ri-arrow-down-s-line"></i>{" "}
                                  </div>
                                </span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        font-weight="600"
                        id="connectId"
                        className="connect-wallet"
                      >
                        <div className=""></div>
                        Connect Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </a>
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
            <NavLink to={"/swap"}>
              <a id="getStartedBtnId" className="get-started-btn get-btn">
                <p className="get-started-text">Get Started</p>
              </a>
            </NavLink>
          </span>
          <div className="learn-more" onClick={handleClick}>
            Learn more
            <i className="learn-more-icon ri-arrow-down-line"></i>
          </div>

          <a
            href="https://lisk.chat"
            className="download-app"
            target="_blank"
            rel="noreferrer"
          >
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
                <p className="">Swap tokens</p>
              </div>
              <div className="c-container-bottom">
                Buy, sell, and explore tokens on Ethereum, Polygon, Optimism,
                and more.
                <div id="cContainerLink" className="c-container-link">
                  Trade Tokens
                </div>
              </div>
            </a>

            {/* Card Two */}
            <a className="swap-tokens-card card-two" href="#/ntfs">
              <div className="trade-title">
                <p className="">Trade NFTs</p>
              </div>
              <div className="c-container-bottom">
                Buy and sell NFTs across marketplaces to find more listings at
                better prices.
                <div id="cContainerLink" className="c-container-link">
                  Explore NFTs
                </div>
              </div>
            </a>
          </div>

          <div className="col-3 small-container-wrapper">
            <a
              className=""
              href="https://support.uniswap.org/hc/en-us/articles/11306574799117-How-to-use-Moon-Pay-on-the-Uniswap-web-app-"
            >
              <div className="crypto-guide c-one">
                <p>Buy crypto</p>
                <img
                  className=""
                  src="/assets/images/dollar-image.png"
                  alt="Earn"
                />
              </div>
              <div className="guide-text">
                Buy crypto with your credit card or bank account at the best
                rates.
                <div id="btnLink" className="button-link">
                  Buy now
                </div>
              </div>
            </a>

            <a
              className=""
              href="https://support.uniswap.org/hc/en-us/articles/11306574799117-How-to-use-Moon-Pay-on-the-Uniswap-web-app-"
            >
              <div className="crypto-guide c-two">
                <p>Earn</p>
                <img
                  className=""
                  src="/assets/images/earn-image.png"
                  alt="Earn"
                />
              </div>
              <div className="guide-text">
                Provide liquidity to pools on Uniswap and earn fees on swaps.
                <div id="btnLink" className="button-link">
                  Provide liquidity
                </div>
              </div>
            </a>
            <a
              className=""
              href="https://support.uniswap.org/hc/en-us/articles/11306574799117-How-to-use-Moon-Pay-on-the-Uniswap-web-app-"
            >
              <div className="crypto-guide c-three">
                <p>Build dApps</p>
                <img
                  className=""
                  src="/assets/images/build-dapps-image.png"
                  alt="Earn"
                />
              </div>
              <div className="guide-text">
                Build apps and tools on the largest DeFi protocol on Ethereum.
                <div id="btnLink" className="button-link">
                  Developer docs
                </div>
              </div>
            </a>
          </div>

          <div className="protocol-card">
            <div className="protocol-left">
              <span className="protocol-title">
                Powered by the Uniswap Protocol
              </span>
              <p className="protocol-text">
                The leading decentralized crypto trading protocol, governed by a
                global community.
              </p>
            </div>
            <div className="protocol-right">
              <a
                id="learnMoreBtn"
                className="learn-more-btn lmb"
                href="https://uniswap.org/"
              >
                Learn more
              </a>
            </div>
          </div>

          <Footer />
        </section>
      </div>
    </React.Fragment>
  );
};

export default Home;
