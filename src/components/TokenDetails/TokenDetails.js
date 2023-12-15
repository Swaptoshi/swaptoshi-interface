import React, { useEffect, useState } from 'react';
import Swap from '../../pages/Swap/Swap'
import './TokenDetails.css';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { NavLink } from 'react-router-dom';

const TokenDetails = ({ allTableData, chartData }) => {

    //ShowMoreBtn
    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => {
        setShowMore(!showMore);
    };

    const [tokensData, setTokensData] = useState(allTableData)
    const { id } = useParams();

    useEffect(() => {
        const tokenDetails = () => {
            const singleToken = allTableData.filter((item) => item.id === Number(id));
            setTokensData(singleToken);

        };

        tokenDetails();
    }, [id, allTableData]);

    function determineTrendIcon(current, old) {
        if (current > old) {
            return <i style={{ color: "rgb(118, 209, 145)" }} className="trends-up-icon ri-arrow-right-up-line"></i>;
        } else if (current < old) {
            return <i style={{ color: "rgb(252, 83, 83)" }} className="trends-down-icon ri-arrow-right-down-line"></i>;
        }
        else if (current === old) {
            return <i style={{ color: "rgb(118, 209, 145)" }} className="trends-up-icon ri-arrow-right-up-line"></i>;
        }
        return null;
    }

    //Calculate Search `dropdown` rates
    function calculatePercentChange(current, old) {
        return Math.abs((current - old) / old * 100);
    }




    return (
        <div>
            <div className="sc-1dv6j2d-0 bCNYil">
                <div
                    data-testid="popups"
                    className="sc-1kykgp9-2 sc-fo3pji-2 kqyYZZ hoPRWs"
                />
                <div className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJh leSroW">
                    <div className="sc-8msj8j-0 jyEmZw">
                        <div className="sc-sx9n2y-0 kandXm sc-8msj8j-1 dihEkF css-x9zcw6">
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://etherscan.io/block/17970396"
                                className="sc-7yzmni-9 jnMVFj"
                            >
                                <div className="sc-d5tbhs-1 cSretk">
                                    <div>17970396 </div>
                                </div>
                            </a>
                        </div>
                        <div className="sc-8msj8j-2 ePKXce" />{" "}
                    </div>
                </div>
                <div className="sc-1evvmet-0 kopCVp">
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
                        data-testid="uniswap-wallet-banner"
                        className="sc-1evvmet-2 bqwZaK"
                    >
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                    </svg>
                    <div className="sc-1kykgp9-2 hinRyL">
                        <div className="sc-sx9n2y-0 EngNh css-10k34qy">
                            Uniswap in your pocket
                        </div>
                    </div>
                    <div className="sc-bczRLJ sc-nrd8cx-0 sc-1evvmet-1 hJYFVB fhPvJh hMzltt">
                        <button
                            width="125px"
                            className="sc-bczRLJ jnEFg sc-fwrjc2-1 sc-1evvmet-3 hgZoRv cXqfrP"
                        >
                            <div className="sc-sx9n2y-0 bhqxth css-18hn7mq">Learn more</div>
                        </button>
                    </div>
                </div>


                <div className="sc-qwzj9s-1 fBEeS">
                    {tokensData.map((data) => (
                        <div className="sc-qwzj9s-2 kUtZkz">
                            <NavLink className="sc-djdxof-0 MpERT" to="/tokens">
                                <i className="ri-arrow-left-line"></i>
                                Tokens
                            </NavLink>

                            <div
                                data-testid="token-info-container"
                                className="sc-qwzj9s-6 kbDyok"
                            >

                                <div className="sc-qwzj9s-7 hfZYqf">
                                    <div className="sc-12k1pn4-3 eLvYRk">
                                        <div className="sc-12k1pn4-2 fEQuSm">
                                            <img
                                                src={data.image}
                                                alt="ETH logo"
                                                className="sc-12k1pn4-1 ejtfTW"
                                            />
                                        </div>
                                        <div className="sc-12k1pn4-4 izFcWZ" />
                                    </div>
                                    <div className="sc-1su5spn-2 gkgzJh">
                                        <span className="textclr">{data.name}</span>
                                        <span className="sc-1su5spn-0 gRPQtw">{data.symbol}</span>
                                    </div>
                                </div>
                                <div className="sc-1su5spn-1 kxJsVh">
                                    <div className="sc-j8s2sa-0 gOFqpR">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width={22}
                                            height={22}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="#fff"
                                            aria-label="ShareOptions"
                                            className="sc-j8s2sa-1 hTKuaT"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4m14-7-5-5-5 5m5-5v12"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="sc-qwzj9s-4 eDREki">
                                <div data-testid="chart-container" className="sc-qwzj9s-4 eDREki">
                                    <div style={{ width: "100%", height: "100%" }}>
                                        <div data-cy="chart-header" className="sc-1nu6e54-3 hZgvDp">
                                            <span className="sc-1nu6e54-4 gLsRgG textclr">${data.price.toFixed(2).toLocaleString()}</span>
                                            <div className="sc-1nu6e54-6 khjLim textclr">
                                                {/* 0.38% */}

                                                <span className='percentage-text' style={{ color: data.price > data.oldPrice ? "rgb(118, 209, 145)" : "rgb(252, 83, 83)" }}>
                                                    <span>
                                                        {calculatePercentChange(data.price, data.oldPrice).toFixed(2)}%
                                                    </span>
                                                </span>
                                                <span>{determineTrendIcon(data.price, data.oldPrice)}</span>

                                            </div>
                                        </div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart width={780} height={392} data={chartData}>
                                                <Line type="monotone" dataKey="uv" stroke="#FB118E" dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>

                                    </div>
                                    <div className="sc-1wj62vu-0 ibmoxq">
                                        <div className="sc-1wj62vu-1 fvQpGv">
                                            <button className="sc-1wj62vu-2 PSFWR">1H</button>
                                            <button className="sc-1wj62vu-2 kRVxFs">1D</button>
                                            <button className="sc-1wj62vu-2 PSFWR">1W</button>
                                            <button className="sc-1wj62vu-2 PSFWR">1M</button>
                                            <button className="sc-1wj62vu-2 PSFWR">1Y</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div data-testid="token-details-stats" className="sc-y05v5v-6 dlmcTg">
                                <div className="sc-sx9n2y-0 kivXvb sc-y05v5v-3 cwCXFN css-1b492mu">
                                    Stats
                                </div>
                                <div className="sc-y05v5v-1 djRLxT">
                                    <div className="sc-y05v5v-2 fJhHgf">
                                        <div data-cy="tvl" className="sc-y05v5v-0 iJvfTG">
                                            <div className="sc-d5tbhs-1 cSretk">
                                                <div>TVL</div>
                                            </div>
                                            <div className="sc-y05v5v-4 iydZZJ">${data.tvl}</div>
                                        </div>
                                        <div data-cy="volume-24h" className="sc-y05v5v-0 iJvfTG">
                                            <div className="sc-d5tbhs-1 cSretk">
                                                <div>24H volume</div>
                                            </div>
                                            {/* <div className="sc-y05v5v-4 iydZZJ">$276.8M</div> */}
                                            <div className="sc-y05v5v-4 iydZZJ">{`$${data.volume.toFixed(2)}`}</div>

                                        </div>
                                    </div>
                                    <div className="sc-y05v5v-2 fJhHgf">
                                        <div data-cy="52w-low" className="sc-y05v5v-0 iJvfTG">
                                            <div className="sc-d5tbhs-1 cSretk">
                                                <div>52W low</div>
                                            </div>
                                            <div className="sc-y05v5v-4 iydZZJ">$1.1K</div>
                                        </div>
                                        <div data-cy="52w-high" className="sc-y05v5v-0 iJvfTG">
                                            <div className="sc-d5tbhs-1 cSretk">
                                                <div>52W high</div>
                                            </div>
                                            <div className="sc-y05v5v-4 iydZZJ">$2.1K</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="sc-qwzj9s-0 hsvmWZ" />
                            <div
                                data-testid="token-details-about-section"
                                className="sc-15bxms1-3 ghcBpv"
                            >
                                <div className="sc-sx9n2y-0 kivXvb sc-15bxms1-4 ebTQjO css-1b492mu">
                                    About
                                </div>
                                <div className="sc-15bxms1-1 MTIbS textclr">
                                    {showMore ? data.bioData : data.bioData.slice(0, 60)}
                                    {data.bioData.length > 100 && (
                                        <div className="sc-15bxms1-2 iHKewj" style={{ cursor: 'pointer' }} onClick={toggleShowMore}>
                                            {showMore ? 'Show less' : 'Show more'}
                                        </div>
                                    )}
                                </div>
                                <br />
                                <div className="sc-sx9n2y-0 bftkTM css-1aekuku">Links</div>
                                <div data-cy="resources-container" className="sc-15bxms1-5 gTErEb">
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://etherscan.io/"
                                        className="sc-7yzmni-9 jnMVFj sc-xu83lq-0 oSKSq"
                                    >
                                        Etherscan<sup>↗</sup>
                                    </a>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://info.uniswap.org/#/tokens/NATIVE"
                                        className="sc-7yzmni-9 jnMVFj sc-xu83lq-0 oSKSq"
                                    >
                                        More analytics<sup>↗</sup>
                                    </a>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://ethereum.org/"
                                        className="sc-7yzmni-9 jnMVFj sc-xu83lq-0 oSKSq"
                                    >
                                        Website<sup>↗</sup>
                                    </a>
                                    <a
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href="https://twitter.com/ethereum"
                                        className="sc-7yzmni-9 jnMVFj sc-xu83lq-0 oSKSq"
                                    >
                                        Twitter<sup>↗</sup>
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}



                    <div className='kFzxb'>
                        <Swap />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default TokenDetails