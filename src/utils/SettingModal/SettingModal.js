import React from 'react';
import './SettingModal.css';

const SettingModal = () => {
    return (
        <div ClassName="imhdhD">
            <div className="Column__AutoColumn-sc-72c388fb-2 Settings__MenuFlyout-sc-6676197f-1 gXqkQO fkhvJx">
                <div className="Column__AutoColumn-sc-72c388fb-2 ereioh">
                    <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB cPkaXY BkVYr">
                        <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 hJYFVB gOYHMo jeYuAz">
                            <div className="Column-sc-72c388fb-0 fnQjPn">
                                <div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-1jljtub">
                                    <div
                                        width="auto"
                                        className="sc-bczRLJ Row-sc-34df4f97-0 jPOzlZ dTUjrT"
                                        style={{ display: "inline-flex" }}
                                    >
                                        <svg
                                            width={10}
                                            height={14}
                                            viewBox="0 0 10 14"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="AutoRouterIconGradient6c42f480-5571-4bdf-a300-02b4fa523b15"
                                                    x1="-10.1807"
                                                    y1="-12.0006"
                                                    x2="10.6573"
                                                    y2="-11.6017"
                                                    gradientUnits="userSpaceOnUse"
                                                >
                                                    <stop stopColor="#4673FA" />
                                                    <stop offset={1} stopColor="#9646FA" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d="M9.97131 6.19803C9.91798 6.07737 9.79866 6.00003 9.66666 6.00003H6.66666V1.00003C6.66666 0.862034 6.58201 0.738037 6.45267 0.688704C6.32267 0.638704 6.17799 0.674696 6.08532 0.776696L0.0853237 7.44336C-0.00267631 7.54136 -0.0253169 7.68137 0.0286831 7.80204C0.0820164 7.9227 0.20133 8.00003 0.33333 8.00003H3.33333V13C3.33333 13.138 3.41799 13.262 3.54732 13.3114C3.58665 13.326 3.62666 13.3334 3.66666 13.3334C3.75933 13.3334 3.85 13.2947 3.91467 13.2227L9.91467 6.55603C10.0027 6.4587 10.0246 6.31803 9.97131 6.19803Z"
                                                fill="url(#AutoRouterIconGradient6c42f480-5571-4bdf-a300-02b4fa523b15)"
                                            />
                                        </svg>
                                        <div className="UniswapXRouterLabel__Gradient-sc-e805e4b5-0 XqKWa">
                                            <div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-1xt5qxb">
                                                UniswapX
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-4u0e4f">
                                    When available, aggregates liquidity sources for better prices and
                                    gas free swaps.{" "}
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://support.uniswap.org/hc/en-us/articles/17515415311501"
                                        className="components__StyledLink-sc-81cd496b-9 rCUQQ"
                                    >
                                        <div className="text__TextWrapper-sc-9327e48a-0 blhgKn RouterPreferenceSettings__InlineLink-sc-4958776c-0 iPLSoH css-4u0e4f">
                                            Learn more
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <button
                            id="toggle-uniswap-x-button"
                            data-testid="toggle-uniswap-x-button"
                            role="option"
                            aria-selected="false"
                            className="Toggle__Wrapper-sc-405c1245-0 cOnDjy"
                        >
                            <span className="Toggle__ToggleElement-sc-405c1245-1 dqIabT" />
                        </button>
                    </div>
                    <div className="components__Divider-sc-81cd496b-33 gFmEMo" />
                    <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB cPkaXY BkVYr">
                        <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowFixed-sc-34df4f97-4 hJYFVB gOYHMo jeYuAz">
                            <div className="Column-sc-72c388fb-0 fnQjPn">
                                <div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-1jljtub">
                                    Local routing
                                </div>
                            </div>
                        </div>
                        <button
                            id="toggle-local-routing-button"
                            data-testid="toggle-local-routing-button"
                            role="option"
                            aria-selected="true"
                            className="Toggle__Wrapper-sc-405c1245-0 cXKarZ"
                        >
                            <span className="Toggle__ToggleElement-sc-405c1245-1 byYXGz" />
                        </button>
                    </div>
                </div>
                <div
                    style={{
                        height: 114,
                        overflow: "hidden",
                        width: "100%",
                        minWidth: "min-content",
                        willChange: "height"
                    }}
                >
                    <div>
                        <div className="Column__AutoColumn-sc-72c388fb-2 Settings__ExpandColumn-sc-6676197f-2 gXqkQO bPIWKe">
                            <div className="components__Divider-sc-81cd496b-33 gFmEMo" />
                            <div className="Column-sc-72c388fb-0 hAwhdH">
                                <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
                                    <div
                                        width="auto"
                                        className="sc-bczRLJ Row-sc-34df4f97-0 jPOzlZ bTQDrP"
                                    >
                                        <div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-1jljtub">
                                            Max slippage
                                        </div>
                                        <span
                                            style={{ marginLeft: 4, display: "flex", alignItems: "center" }}
                                        >
                                            <div className="Popover__ReferenceElement-sc-f19d15a-1 bndAvc">
                                                <div className="QuestionHelper__QuestionWrapper-sc-76ddd2cf-0 izoILe">
                                                    <span className="QuestionHelper__QuestionMark-sc-76ddd2cf-1 bEjIrx">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={16}
                                                            height={16}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <circle cx={12} cy={12} r={10} />
                                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                                            <line x1={12} y1={17} x2="12.01" y2={17} />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div
                                        data-testid="max-slippage-settings"
                                        aria-expanded="false"
                                        className="sc-bczRLJ Row-sc-34df4f97-0 Expand__ButtonContainer-sc-c6541f6c-0 hJYFVB gOYHMo kwEKCQ"
                                    >
                                        <div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1jljtub">
                                            Auto
                                        </div>
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
                                            className="Expand__ExpandIcon-sc-c6541f6c-1 kdjsvs"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        height: 0,
                                        overflow: "hidden",
                                        width: "100%",
                                        minWidth: "min-content",
                                        willChange: "height"
                                    }}
                                >
                                    <div>
                                        <div className="Column-sc-72c388fb-0 Expand__Content-sc-c6541f6c-2 eqAZdA dKVRAc">
                                            <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB bObhWT BkVYr">
                                                <div className="sc-bczRLJ Row-sc-34df4f97-0 MaxSlippageSettings__Switch-sc-ab328b30-1 hJYFVB gOYHMo krAXBK">
                                                    <div className="sc-bczRLJ Row-sc-34df4f97-0 MaxSlippageSettings__Option-sc-ab328b30-0 hJYFVB gOYHMo ccVORp">
                                                        <div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1jljtub">
                                                            Auto
                                                        </div>
                                                    </div>
                                                    <div className="sc-bczRLJ Row-sc-34df4f97-0 MaxSlippageSettings__Option-sc-ab328b30-0 hJYFVB gOYHMo jYYYB">
                                                        <div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1jljtub">
                                                            Custom
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-bczRLJ Row-sc-34df4f97-0 Input__InputContainer-sc-ddc3b6a9-1 hJYFVB bObhWT gjcFql">
                                                    <input
                                                        data-testid="slippage-input"
                                                        placeholder="0.50"
                                                        className="Input-sc-ddc3b6a9-0 bqpUJc"
                                                        defaultValue=""
                                                    />
                                                    <div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1jljtub">
                                                        %
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="components__Divider-sc-81cd496b-33 gFmEMo" />
                            <div className="Column-sc-72c388fb-0 hAwhdH">
                                <div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
                                    <div
                                        width="auto"
                                        className="sc-bczRLJ Row-sc-34df4f97-0 jPOzlZ bTQDrP"
                                    >
                                        <div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-1jljtub">
                                            Transaction deadline
                                        </div>
                                        <span
                                            style={{ marginLeft: 4, display: "flex", alignItems: "center" }}
                                        >
                                            <div className="Popover__ReferenceElement-sc-f19d15a-1 bndAvc">
                                                <div className="QuestionHelper__QuestionWrapper-sc-76ddd2cf-0 izoILe">
                                                    <span className="QuestionHelper__QuestionMark-sc-76ddd2cf-1 bEjIrx">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={16}
                                                            height={16}
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <circle cx={12} cy={12} r={10} />
                                                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                                                            <line x1={12} y1={17} x2="12.01" y2={17} />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </span>
                                    </div>
                                    <div
                                        data-testid="transaction-deadline-settings"
                                        aria-expanded="false"
                                        className="sc-bczRLJ Row-sc-34df4f97-0 Expand__ButtonContainer-sc-c6541f6c-0 hJYFVB gOYHMo kwEKCQ"
                                    >
                                        30m
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
                                            className="Expand__ExpandIcon-sc-c6541f6c-1 kdjsvs"
                                        >
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        height: 0,
                                        overflow: "hidden",
                                        width: "100%",
                                        minWidth: "min-content",
                                        willChange: "height"
                                    }}
                                >
                                    <div>
                                        <div className="Column-sc-72c388fb-0 Expand__Content-sc-c6541f6c-2 eqAZdA dKVRAc">
                                            <div className="sc-bczRLJ Row-sc-34df4f97-0 hJYFVB gOYHMo">
                                                <div className="sc-bczRLJ Row-sc-34df4f97-0 Input__InputContainer-sc-ddc3b6a9-1 hJYFVB bObhWT gjcFql">
                                                    <input
                                                        data-testid="deadline-input"
                                                        placeholder={30}
                                                        className="Input-sc-ddc3b6a9-0 bqpUJc"
                                                        defaultValue=""
                                                    />
                                                    <div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1jljtub">
                                                        minutes
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SettingModal