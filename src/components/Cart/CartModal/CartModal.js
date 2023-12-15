import React, { useState } from 'react';
import './CartModal.css';
const CartModal = ({
    swapModal,
    setSwapModal,
    swapTokens,
    selectedToken,
    // handleTokenSelect
    handleSelect,
    isLiquidity = false
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleTokenChange = (e) => {
        setSearchTerm(e.target.value);
    }

    const filteredTokenSearch = swapTokens?.filter(token =>
        token.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <div
                className={`sc-jajvtp-0 bmYGet`}
                data-reach-dialog-overlay=""
                style={{ display: swapModal ? 'flex' : 'none' }}
            >
                <div
                    aria-modal="true"
                    role="dialog"
                    tabIndex={-1}
                    aria-label="dialog"
                    className="sc-jajvtp-1 jBBXQD"
                    data-reach-dialog-content=""
                >
                    <div className="sc-1kykgp9-0 sc-1it7zu4-0 iCxowP fUHrnW">
                        <div className="sc-1kykgp9-2 sc-1xp9ndq-0 kqzAOQ eOCLUf">
                            <div id="cross-title" className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJeh frnZMKK" >
                                <div className="css-xy7yfl">Select a token</div>
                                <span onClick={() => setSwapModal(false)}>
                                    <i className="close-modal ri-close-line"></i>
                                </span>
                            </div>
                            <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB fhPvJeh">
                                <input
                                    type="text"
                                    id="token-search-input"
                                    data-testid="token-search-input"
                                    placeholder="Search name or paste address"
                                    autoComplete="off"
                                    className="sc-1xp9ndq-2 hxoNas"
                                    value={searchTerm}
                                    onChange={handleTokenChange}
                                />
                            </div>
                            <div className="sc-1kykgp9-2 sc-jm24e0-0 kqyzGE gqQqei">
                                <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-3 hJYFVB cTSGxd bORAza" >
                                    {swapTokens?.map(token => (
                                        <div
                                            key={token?.value}
                                            // onClick={() => handleTokenSelect(token)}
                                            onClick={() => handleSelect(token, isLiquidity)}
                                            className={`sc-jm24e0-1 fosiKD ${selectedToken?.symbol === token?.symbol ? "active" : ""}`}
                                        >
                                            <div className="sc-12k1pn4-2 ckpBIe" style={{ marginRight: 8 }}>
                                                <img
                                                    src={token?.imgSrc}
                                                    alt={token?.symbol}
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>

                                            <div className="css-xy7yfl">{token?.symbol}</div>
                                        </div>
                                    ))}

                                    {/* <div
                                        tabIndex={0}
                                        data-testid="common-base-ETH"
                                        className="sc-jm24e0-1 ipXHOd"
                                    >
                                        <div className="sc-12k1pn4-3 eLvYRk" style={{ marginRight: 8 }}>
                                            <div className="sc-12k1pn4-2 ckpBIe">
                                                <img
                                                    src="/assets/images/tokens/eth-icon.png"
                                                    alt="ETH logo"
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>
                                        </div>
                                        <div className="css-xy7yfl">ETH</div>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        data-testid="common-base-DAI"
                                        className="sc-jm24e0-1 fosiKD"
                                    >
                                        <div className="sc-12k1pn4-3 eLvYRk" style={{ marginRight: 8 }}>
                                            <div className="sc-12k1pn4-2 ckpBIe">
                                                <img
                                                    src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png"
                                                    alt="DAI logo"
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>
                                        </div>
                                        <div className="css-xy7yfl">DAI</div>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        data-testid="common-base-USDC"
                                        className="sc-jm24e0-1 fosiKD"
                                    >
                                        <div className="sc-12k1pn4-3 eLvYRk" style={{ marginRight: 8 }}>
                                            <div className="sc-12k1pn4-2 ckpBIe">
                                                <img
                                                    src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
                                                    alt="USDC logo"
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>
                                        </div>
                                        <div className="css-xy7yfl">USDC</div>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        data-testid="common-base-USDT"
                                        className="sc-jm24e0-1 fosiKD"
                                    >
                                        <div className="sc-12k1pn4-3 eLvYRk" style={{ marginRight: 8 }}>
                                            <div className="sc-12k1pn4-2 ckpBIe">
                                                <img
                                                    src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
                                                    alt="USDT logo"
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>
                                        </div>
                                        <div className="css-xy7yfl">USDT</div>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        data-testid="common-base-WBTC"
                                        className="sc-jm24e0-1 fosiKD"
                                    >
                                        <div className="sc-12k1pn4-3 eLvYRk" style={{ marginRight: 8 }}>
                                            <div className="sc-12k1pn4-2 ckpBIe">
                                                <img
                                                    src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png"
                                                    alt="WBTC logo"
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>
                                        </div>
                                        <div className="css-xy7yfl">WBTC</div>
                                    </div>
                                    <div
                                        tabIndex={0}
                                        data-testid="common-base-WETH"
                                        className="sc-jm24e0-1 fosiKD"
                                    >
                                        <div className="sc-12k1pn4-3 eLvYRk" style={{ marginRight: 8 }}>
                                            <div className="sc-12k1pn4-2 ckpBIe">
                                                <img
                                                    src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
                                                    alt="WETH logo"
                                                    className="sc-12k1pn4-1 bwVixy"
                                                />
                                            </div>
                                        </div>
                                        <div className="css-xy7yfl">WETH</div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                        <div className="sc-1xp9ndq-3 cbqHzZ" />
                        <div style={{ flex: "1 1 0%", position: "relative" }}>
                            <div style={{ overflow: "visible", height: 0 }}>

                                <div

                                    data-testid="currency-list-wrapper"
                                    className="sc-1e2o00j-5 kszyds"
                                >
                                    <div
                                        className="_1pi21y70"
                                        style={{
                                            height: "100%",
                                            maxHeight: "400px",
                                            overflowY: "scroll",
                                            paddingTop: "4px",
                                            paddingBottom: "20px"
                                        }}
                                    >
                                        {filteredTokenSearch?.map((item, index) => (
                                            <div key={item.id}
                                                tabIndex={0}
                                                className={`hJYFVB fhPvJeh frnZMKK edPdrxe token-item-ETHER ${selectedToken?.label === item?.label ? 'active ' : ""}`}
                                                disabled=""
                                                onClick={() => handleSelect(item, isLiquidity)}
                                            >
                                                <div className="sc-1kykgp9-0 iCxowP">
                                                    <div className="sc-12k1pn4-3 eLvYRk" style={{ opacity: 1 }}>
                                                        <div className="sc-12k1pn4-2 oJGcu">
                                                            <img
                                                                src={item?.imgSrc}
                                                                alt="Token logo"
                                                                className="sc-12k1pn4-1 gxjzue"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="sc-1kykgp9-2 jdTKGL" style={{ opacity: 1 }}>
                                                    <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB fhPvJeh">
                                                        <div
                                                            title={item?.label}
                                                            className="sc-1e2o00j-2 dmGdpm css-vurnku"
                                                        >
                                                            {item?.label}
                                                        </div>
                                                        <div className="sc-1e2o00j-4 wHspX" />
                                                    </div>
                                                    <div className="sc-sx9n2y-0 bqwbXT css-yfjwjl">
                                                        {/* {item.symbol} */}
                                                        {item?.symbol}
                                                    </div>
                                                </div>
                                                <div className="sc-1kykgp9-0 iCxowP">
                                                    <div
                                                        className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
                                                        style={{ justifySelf: "flex-end" }}
                                                    />
                                                </div>
                                                <div
                                                    className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
                                                    style={{ justifySelf: "flex-end" }}
                                                >
                                                    {/* <i className="swap-tick ri-check-line"></i> */}
                                                    {selectedToken?.label === item?.label && (
                                                        <i className="swap-tick ri-check-line"></i>
                                                    )}

                                                </div>
                                            </div>

                                        ))}


                                    </div>
                                </div>

                                {/* <div
                                            tabIndex={0}
                                            className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 sc-1xp9ndq-1 hJYFVB fhPvJeh frnZMKK bPeMEk token-item-0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: 56,
                                                height: 56,
                                                width: "100%"
                                            }}
                                        >
                                            <div className="sc-1kykgp9-0 iCxowP">
                                                <div className="sc-12k1pn4-3 eLvYRk" style={{ opacity: 1 }}>
                                                    <div className="sc-12k1pn4-2 oJGcu">
                                                        <img
                                                            src="https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png"
                                                            alt="WETH logo"
                                                            className="sc-12k1pn4-1 gxjzue"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sc-1kykgp9-2 jdTKGL" style={{ opacity: 1 }}>
                                                <div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB fhPvJeh">
                                                    <div
                                                        title="Wrapped Ether"
                                                        className="sc-1e2o00j-2 dmGdpm css-vurnku"
                                                    >
                                                        Wrapped Ether
                                                    </div>
                                                    <div className="sc-1e2o00j-4 wHspX" />
                                                </div>
                                                <div className="sc-sx9n2y-0 bqwbXT css-yfjwjl">WETH</div>
                                            </div>
                                            <div className="sc-1kykgp9-0 iCxowP">
                                                <div
                                                    className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
                                                    style={{ justifySelf: "flex-end" }}
                                                />
                                            </div>
                                            <div
                                                className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
                                                style={{ justifySelf: "flex-end" }}
                                            />
                                        </div>
                                        <div
                                            tabIndex={0}
                                            className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 sc-1xp9ndq-1 hJYFVB fhPvJeh frnZMKK bPeMEk token-item-0x111111111117dC0aa78b770fA6A738034120C302"
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: 112,
                                                height: 56,
                                                width: "100%"
                                            }}
                                        >
                                            <div
                                                className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
                                                style={{ justifySelf: "flex-end" }}
                                            />
                                        </div> */}
                                {/* </div> */}
                                {/* </div> */}
                                {/* </div> */}
                            </div>
                            <div className="resize-triggers">
                                <div className="expand-trigger">
                                    <div style={{ width: 419, height: 345 }} />
                                </div>
                                <div className="contract-trigger" />
                            </div>
                        </div>
                    </div >
                </div >
            </div >

        </div >
    )
}

export default CartModal