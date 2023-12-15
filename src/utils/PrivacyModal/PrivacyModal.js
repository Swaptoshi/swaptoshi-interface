import React from 'react';
import './PrivacyModal.css';

const PrivacyModal = ({ privacyModal, setPrivacyModal }) => {



    return (
        <div className="bCNYil">
            <div
                className="sc-jajvtp-0 ehpVfL"
                data-reach-dialog-overlay=""
                // style={{ display: privacyModal ? 'flex' : 'none' }}
                style={{ opacity: 1 }}
            >
                <div
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                    aria-label="dialog"
                    className="sc-jajvtp-1 dwnvhz"
                    data-reach-dialog-content=""
                >
                    <div className="sc-1kykgp9-2 kqyzGE">
                        <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 gIzieT gqRmqj frnZMK">
                            <div className="sc-sx9n2y-0 kandXm css-68pfx3">Legal &amp; Privacy</div>
                            <a href='/'>
                                <div className="sc-z1xxjf-2 kGICmr" >

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
                                    >
                                        <line x1={18} y1={6} x2={6} y2={18} />
                                        <line x1={6} y1={6} x2={18} y2={18} />
                                    </svg>

                                </div>
                            </a>
                        </div>
                        <div draggable="true" className="sc-z1xxjf-0 jraKIU">
                            <div className="sc-1kykgp9-2 kqzAOQ">
                                <div className="sc-1kykgp9-2 hinRyL" style={{ width: "100%" }}>
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-z1xxjf-1 hJYFVB hqshMl cywtsm">
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://uniswap.org/terms-of-service"
                                            className="sc-7yzmni-9 koQguv"
                                        >
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJh frnZMK">
                                                <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx={12} cy={12} r={10} />
                                                        <line x1={12} y1={16} x2={12} y2={12} />
                                                        <line x1={12} y1={8} x2="12.01" y2={8} />
                                                    </svg>
                                                    <div className="sc-sx9n2y-0 kcDJjM css-1aekuku">
                                                        Uniswap Labs' Terms of Service
                                                    </div>
                                                </div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="sc-z1xxjf-3 hsknPm"
                                                >
                                                    <line x1={12} y1={5} x2={12} y2={19} />
                                                    <polyline points="19 12 12 19 5 12" />
                                                </svg>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-z1xxjf-1 hJYFVB hqshMl cywtsm">
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href="https://uniswap.org/privacy-policy/"
                                            className="sc-7yzmni-9 koQguv"
                                        >
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJh frnZMK">
                                                <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width={20}
                                                        height={20}
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth={2}
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <circle cx={12} cy={12} r={10} />
                                                        <line x1={12} y1={16} x2={12} y2={12} />
                                                        <line x1={12} y1={8} x2="12.01" y2={8} />
                                                    </svg>
                                                    <div className="sc-sx9n2y-0 kcDJjM css-1aekuku">
                                                        Privacy Policy
                                                    </div>
                                                </div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="sc-z1xxjf-3 hsknPm"
                                                >
                                                    <line x1={12} y1={5} x2={12} y2={19} />
                                                    <polyline points="19 12 12 19 5 12" />
                                                </svg>
                                            </div>
                                        </a>
                                    </div>
                                </div>
                                <div className="sc-sx9n2y-0 bqwbXT css-1aekuku">
                                    This app uses the following third-party APIs:
                                </div>
                                <div className="sc-1kykgp9-2 kqyzGE">
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-57i8km-3 hJYFVB hqshMl eftBvH">
                                        <div className="sc-1kykgp9-2 hinRyL">
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx={12} cy={12} r={10} />
                                                    <line x1={12} y1={16} x2={12} y2={12} />
                                                    <line x1={12} y1={8} x2="12.01" y2={8} />
                                                </svg>
                                                <div className="sc-sx9n2y-0 EngNh css-1aekuku">
                                                    Auto Router
                                                </div>
                                            </div>
                                            <div className="sc-sx9n2y-0 bqwbXT css-1aekuku">
                                                The app fetches the optimal trade route from a Uniswap Labs
                                                server.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-57i8km-3 hJYFVB hqshMl eftBvH">
                                        <div className="sc-1kykgp9-2 hinRyL">
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx={12} cy={12} r={10} />
                                                    <line x1={12} y1={16} x2={12} y2={12} />
                                                    <line x1={12} y1={8} x2="12.01" y2={8} />
                                                </svg>
                                                <div className="sc-sx9n2y-0 EngNh css-1aekuku">Infura</div>
                                            </div>
                                            <div className="sc-sx9n2y-0 bqwbXT css-1aekuku">
                                                The app fetches on-chain data and constructs contract calls
                                                with an Infura API.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-57i8km-3 hJYFVB hqshMl eftBvH">
                                        <div className="sc-1kykgp9-2 hinRyL">
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx={12} cy={12} r={10} />
                                                    <line x1={12} y1={16} x2={12} y2={12} />
                                                    <line x1={12} y1={8} x2="12.01" y2={8} />
                                                </svg>
                                                <div className="sc-sx9n2y-0 EngNh css-1aekuku">TRM Labs</div>
                                            </div>
                                            <div className="sc-sx9n2y-0 bqwbXT css-1aekuku">
                                                The app securely collects your wallet address and shares it
                                                with TRM Labs Inc. for risk and compliance reasons.{" "}
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href="https://help.uniswap.org/en/articles/5675203-terms-of-service-faq"
                                                    className="sc-7yzmni-9 koQguv"
                                                >
                                                    Learn more
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-57i8km-3 hJYFVB hqshMl eftBvH">
                                        <div className="sc-1kykgp9-2 hinRyL">
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx={12} cy={12} r={10} />
                                                    <line x1={12} y1={16} x2={12} y2={12} />
                                                    <line x1={12} y1={8} x2="12.01" y2={8} />
                                                </svg>
                                                <div className="sc-sx9n2y-0 EngNh css-1aekuku">
                                                    Google Analytics &amp; Amplitude
                                                </div>
                                            </div>
                                            <div className="sc-sx9n2y-0 bqwbXT css-1aekuku">
                                                The app logs anonymized usage statistics in order to improve
                                                over time.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-bczRLJ sc-57i8km-0 sc-57i8km-3 hJYFVB hqshMl eftBvH">
                                        <div className="sc-1kykgp9-2 hinRyL">
                                            <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={18}
                                                    height={18}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx={12} cy={12} r={10} />
                                                    <line x1={12} y1={16} x2={12} y2={12} />
                                                    <line x1={12} y1={8} x2="12.01" y2={8} />
                                                </svg>
                                                <div className="sc-sx9n2y-0 EngNh css-1aekuku">The Graph</div>
                                            </div>
                                            <div className="sc-sx9n2y-0 bqwbXT css-1aekuku">
                                                The app fetches blockchain data from The Graph’s hosted
                                                service.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-sx9n2y-0 EngNh css-4u0e4f">
                                        <div className="sc-bczRLJ sc-nrd8cx-0 eHQTZv hxlas">
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href="https://help.uniswap.org/en/articles/5675203-terms-of-service-faq"
                                                className="sc-7yzmni-9 koQguv"
                                            >
                                                Learn more
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div >
    )
}

export default PrivacyModal;