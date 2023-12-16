import React from "react";
import { useTheme } from "../../context/ThemeProvider";

export default function ConfigModal({
  onClose,
  onThemeAuto,
  onThemeLight,
  onThemeDark,
}) {
  const [currentTheme] = useTheme();

  return (
    <div className={`sc-3dvm1v-2 dLsVJq open`}>
      <div className="sc-3dvm1v-0 eTxptr" open="" />
      <div className="sc-3dvm1v-3 hyeENl" open="">
        <div id="wallet-dropdown-scroll-wrapper" className="sc-3dvm1v-1 fijsNj">
          <div className="sc-1kykgp9-0 sc-11yue4p-0 iCxowP kfarYJ">
            <div className="sc-1xe6nb0-0 cnmVKz">
              <div className="sc-1xe6nb0-3 fjOrSN">
                <i
                  className="back-arrow ri-arrow-left-line"
                  onClick={onClose}
                ></i>
                <span className="sc-1xe6nb0-1 UbGpC">
                  <div className="sc-sx9n2y-0 kivXvb css-rjqmed">Settings</div>
                </span>
              </div>
              <div className="sc-sx9n2y-0 kivXvb sc-k6pz4u-1 bepFek css-rjqmed">
                Preferences
              </div>
              <div className="sc-k6pz4u-2 bqhmxH">
                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz1">
                  <div
                    width="40%"
                    className="sc-bczRLJ sc-nrd8cx-0 gxbXPT feIyWM"
                  >
                    <div className="sc-sx9n2y-0 kandXm css-1aekuku">Theme</div>
                  </div>
                  <div
                    width="60%"
                    className="sc-bczRLJ sc-nrd8cx-0 foniQS jGtsjx"
                  >
                    <div className="sc-bczRLJ sc-nrd8cx-0 sc-1euncec-1 hJYFVB xyz1 etXiLa">
                      <div
                        data-testid="theme-auto"
                        onClick={onThemeAuto}
                        className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
                          currentTheme === "system" ? "eqaHKd" : ""
                        }`}
                      >
                        <div className="sc-sx9n2y-0 kandXm css-rjqmed text">
                          Auto
                        </div>
                      </div>
                      <div
                        data-testid="theme-lightmode"
                        className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
                          currentTheme === "light" ? "eqaHKd" : ""
                        }`}
                        onClick={onThemeLight}
                      >
                        <i className="sun ri-sun-line"></i>
                        <div className="sc-sx9n2y-0 kandXm css-rjqmed" />
                      </div>
                      <div
                        data-testid="theme-darkmode"
                        className={`sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 sc-1euncec-0 hJYFVB xyz1 kHFzEX ${
                          currentTheme === "dark" ? "eqaHKd" : ""
                        }`}
                        onClick={onThemeDark}
                      >
                        <i className="moon ri-moon-line"></i>

                        <div className="sc-sx9n2y-0 kandXm css-rjqmed" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                  <div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
                    <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                      <div className="sc-sx9n2y-0 kivXvb css-1aekuku">
                        Hide small balances
                      </div>
                    </div>
                  </div>
                  <button
                    role="option"
                    aria-selected="true"
                    className="sc-1poje5t-0 jANAGB"
                  >
                    <span className="sc-1poje5t-1 jsjUXs" />
                  </button>
                </div>
                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                  <div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
                    <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                      <div className="sc-sx9n2y-0 kivXvb css-1aekuku">
                        Allow analytics
                      </div>
                    </div>
                    <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                      {/* <div className="bftkTM css-mx5ldy">
                                                                        We use anonymized data to enhance your experience with
                                                                        Uniswap Labs products.
                                                                    </div> */}
                    </div>
                  </div>
                  <button
                    role="option"
                    aria-selected="true"
                    className="sc-1poje5t-0 jANAGB"
                  >
                    <span className="sc-1poje5t-1 jsjUXs" />
                  </button>
                </div>
                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                  <div className="sc-1kykgp9-0 sc-1opkkz6-0 iCxowP kMuqSe">
                    <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB xyz12">
                      <div className="sc-sx9n2y-0 kivXvb css-1aekuku">
                        Show testnets
                      </div>
                    </div>
                  </div>
                  <button
                    id="testnets-toggle"
                    data-testid="testnets-toggle"
                    role="option"
                    aria-selected="false"
                    className="sc-1poje5t-0 ffxhvk"
                  >
                    <span className="sc-1poje5t-1 bQBOQe" />
                  </button>
                </div>
              </div>
              <div
                data-testid="wallet-header"
                className="sc-sx9n2y-0 kivXvb sc-k6pz4u-1 bepFek css-rjqmed"
              >
                Language
              </div>

              <a className="sc-k6pz4u-0 iFDhEy" href="#/nfts?lng=en-US">
                <div
                  data-testid="wallet-language-item"
                  className="sc-sx9n2y-0 kivXvb css-zhpkf8"
                >
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
                  <div className="sc-sx9n2y-0 bqwbXT css-zhpkf8">
                    Version: 7edf32
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
