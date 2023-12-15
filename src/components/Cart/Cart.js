import React, { useState, useEffect } from 'react';
import './Cart.css';

const Cart = ({ addToBag, setIsCartVisible, onRemoveBagItem }) => {
    const [totalEth, setTotalEth] = useState(0);
    const [showConnectWallet, setShowConnectWallet] = useState(true);

    useEffect(() => {
        let total = 0;
        addToBag?.forEach(item => {
            total += item.ethValue;
        });
        setTotalEth(total);
    }, [addToBag]);

    return (
        <div>

            <div data-testid="nft-bag" className="Bag__BagContainer-sc-26f55410-0 mbicD">
                <div className="BagHeader__Wrapper-sc-f9c49788-3 OOdOb">
                    <div className="text__TextWrapper-sc-b23cf51f-0 iPDTcg css-1jyz67g">
                        Bag
                    </div>
                    <div className="BagHeader__CounterDot-sc-f9c49788-2 bFaCiP">{addToBag?.length}</div>
                    <button className="components_ButtonText-sc-12cffa39-3 BagHeader_ClearButton-sc-f9c49788-0 gCefrI IobEG">
                        Clear all
                    </button>
                    <button className="BagHeader__IconWrapper-sc-f9c49788-1 kmmWVR" onClick={() => setIsCartVisible(false)}>
                        <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            data-testid="nft-bag-close-icon"
                        >
                            <path
                                d="M18.7071 6.70711C19.0976 6.31658 19.0976 5.68342 18.7071 5.29289C18.3166 4.90237 17.6834 4.90237 17.2929 5.29289L18.7071 6.70711ZM5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L5.29289 17.2929ZM6.70711 5.29289C6.31658 4.90237 5.68342 4.90237 5.29289 5.29289C4.90237 5.68342 4.90237 6.31658 5.29289 6.70711L6.70711 5.29289ZM17.2929 18.7071C17.6834 19.0976 18.3166 19.0976 18.7071 18.7071C19.0976 18.3166 19.0976 17.6834 18.7071 17.2929L17.2929 18.7071ZM17.2929 5.29289L5.29289 17.2929L6.70711 18.7071L18.7071 6.70711L17.2929 5.29289ZM5.29289 6.70711L17.2929 18.7071L18.7071 17.2929L6.70711 5.29289L5.29289 6.70711Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>
                </div>
                <div className="_1klryar0 rgw6ezml rgw6ezs3 rgw6ez895 rgw6ez7zp rgw6ez59f rgw6ez6hf rgw6ez5yr rgw6ez4a9 rgw6ez8e1" />


                <div>
                    {addToBag?.map((item) => (
                        <div className="_1klryar0 rgw6ez44r rgw6ez473 rgw6ez3tf _1jcz50r1 rgw6ez2ef rgw6ez2jx rgw6ez1yr rgw6ez8ct" id={item.id}>
                            <div className="_1klryar0 rgw6ez44f rgw6ez473" />
                            <div className="_1klryar0 rgw6ez44r rgw6ez473">
                                <a
                                    href="#/nfts/asset/0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d/5795"
                                    style={{ textDecoration: "none" }}
                                    className="item-container"
                                >
                                    <div className="_1klryar0 rgw6ez44r rgw6ez46x rgw6ez3x _1kuawc1 rgw6ez2dr rgw6ez2j9 rgw6ez2of rgw6ez27x rgw6ez4b9 rgw6ez3tf rgw6ez7zd rgw6ez1dr rgw6ez80x">
                                        <div className="_1klryar0 rgw6ez48x rgw6ez44r">
                                            <img
                                                className="_1klryar0 rgw6ez46l rgw6ez149 rgw6ez1b9 rgw6ez49l rgw6ez80p"
                                                // src="https://i.seadn.io/gae/wN0r-6Axvdo5evMruw97dBlaZTfK_7VCk9lXWI5SWubZD_0ako-sUpByCUgzc-o8ZgnLwgdVbY9_A4WqqkEpEO7Ztrb7oYQKcvCpjA?w=500&auto=format"
                                                src={item.image}
                                            />
                                        </div>
                                        <div className="_1klryar0 rgw6ez44r rgw6ez473 rgw6ez8bh rgw6ez16r rgw6ez4b9">
                                            <div className="_1klryar0 rgw6ez44r rgw6ez46x rgw6ez3x rgw6ez8bh rgw6ez16r rgw6ez45l">
                                                <div className="_1klryar0 _1kuawcb rgw6ezbf rgw6ezd9 rgw6ez8bh rgw6ez45r rgw6ez45l">
                                                    {item.cardNumber}
                                                    {/* 7788 */}
                                                </div>
                                            </div>
                                            <div className="_1klryar0 rgw6ez44r rgw6ez46x rgw6ez3x rgw6ez8bh rgw6ez45l rgw6ez3sl">
                                                <div className="_1klryar0 rgw6ezd3 rgw6ezb9 rgw6eze3 rgw6ez8bh rgw6ez45l rgw6ez45r rgw6ez4bf">
                                                    {item.title}
                                                    {/* BoredApeYachtClub */}
                                                </div>
                                                <svg
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 20 20"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="rgw6ez3xr"
                                                >
                                                    <path
                                                        d="M4.52795 13.8056C4.52719 14.4043 4.6712 14.8474 4.95997 15.135C5.24798 15.4233 5.68496 15.5651 6.27091 15.5605H7.57497C7.62945 15.5585 7.68379 15.5676 7.73463 15.5873C7.78547 15.607 7.83176 15.6369 7.87062 15.6752L8.79884 16.5928C9.22054 17.0142 9.63382 17.2237 10.0387 17.2214C10.4436 17.2191 10.8569 17.0096 11.2786 16.5928L12.1954 15.6752C12.2356 15.6365 12.2832 15.6063 12.3354 15.5866C12.3876 15.5669 12.4433 15.558 12.499 15.5605H13.7951C14.3871 15.5613 14.8283 15.4171 15.1186 15.1281C15.4089 14.839 15.5541 14.3959 15.5541 13.7987V12.5014C15.5511 12.389 15.5923 12.2799 15.6687 12.1974L16.5854 11.2798C17.0125 10.86 17.2245 10.4467 17.2214 10.0399C17.2184 9.63305 17.0064 9.21935 16.5854 8.79878L15.6687 7.88115C15.592 7.79886 15.5509 7.68965 15.5541 7.57719V6.2799C15.5533 5.68191 15.4093 5.23878 15.1221 4.95049C14.8348 4.66221 14.3925 4.51806 13.7951 4.51806H12.499C12.4433 4.52036 12.3877 4.51138 12.3355 4.49168C12.2834 4.47197 12.2357 4.44193 12.1954 4.40336L11.2786 3.48574C10.8569 3.06439 10.4436 2.85487 10.0387 2.85717C9.63382 2.85946 9.22054 3.06898 8.79884 3.48574L7.87062 4.40336C7.83164 4.44148 7.78536 4.4713 7.73454 4.49101C7.68373 4.51072 7.62943 4.51993 7.57497 4.51806H6.27091C5.67961 4.51883 5.23995 4.66182 4.95194 4.94705C4.66393 5.23228 4.51992 5.67656 4.51992 6.2799V7.58063C4.52314 7.69309 4.48197 7.80229 4.40533 7.88459L3.48859 8.80222C3.06765 9.22203 2.85718 9.63572 2.85718 10.0433C2.85718 10.4509 3.07033 10.8653 3.49662 11.2867L4.41336 12.2043C4.48979 12.2867 4.53092 12.3958 4.52795 12.5083V13.8056Z"
                                                        fill="#FC72FF"
                                                    />
                                                    <path
                                                        d="M9.99737 12.4943C9.86205 12.7005 9.6623 12.8164 9.43032 12.8164C9.19191 12.8164 9.00504 12.7198 8.83106 12.4943L7.31036 10.6385C7.20082 10.5032 7.14282 10.3614 7.14282 10.2068C7.14282 9.88458 7.38768 9.63327 7.70342 9.63327C7.89673 9.63327 8.05138 9.70415 8.20603 9.90391L9.40455 11.4311L11.9498 7.34577C12.0851 7.12669 12.2591 7.02359 12.4524 7.02359C12.7553 7.02359 13.0388 7.23623 13.0388 7.55197C13.0388 7.70017 12.9615 7.85482 12.8777 7.99014L9.99737 12.4943Z"
                                                        fill="white"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="number-display-container">
                                            <div className="number-container">
                                                <div className="_1klryar0 rgw6ez44r rgw6ez473 rgw6ez3xr rgw6ez43">
                                                    <div className="_1klryar0 _1kuawc9 rgw6ez3sr rgw6ezbf rgw6ezd9 rgw6ez3xr" >
                                                        {/* 28.75&nbsp;ETH */}
                                                        {/* {`${item.ethValue} ETH`} */}
                                                        <span className='' style={{ display: 'inline-block', marginRight: "20px" }}>
                                                            {`${item.ethValue} ETH `}

                                                        </span>

                                                    </div>
                                                    <div className="_1klryar0 rgw6ezd3 rgw6ezb9 rgw6eze3 rgw6ez8bh rgw6ez45l rgw6ez45r rgw6ez4bf">
                                                        {/* $48,394.59 */}
                                                        <span className='' style={{ display: 'inline-block', marginRight: "20px" }}>

                                                            {`$${item.priceValue.toFixed(2)}`}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    size={1}
                                                    className="Button_BaseThemeButton-sc-983e32f-16 jGQBnY BagRow_RemoveButton-sc-3b559d1f-0 gbCQLu"
                                                    onClick={() => onRemoveBagItem(item)}>
                                                    <div className="Button__ButtonOverlay-sc-983e32f-0 hxfTDQ" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>

                    ))}
                    {showConnectWallet && addToBag?.length > 0 && (
                        <div className="BagFooter__FooterContainer-sc-8e61f205-0 isERZK">
                            <div className="BagFooter__Footer-sc-8e61f205-1 gLQTOK">
                                <div className="Column-sc-72c388fb-0 BagFooter__FooterHeader-sc-8e61f205-2 fnQjPn ixcFPf">
                                    <div className="sc-bczRLJ Row-sc-34df4f97-0 BagFooter__CurrencyRow-sc-8e61f205-3 hJYFVB pay-with fevJyp">
                                        <div className="Column-sc-72c388fb-0 fnQjPn">
                                            <div className="text__TextWrapper-sc-b23cf51f-0 gTElMf css-142zc9n">
                                                Pay with
                                            </div>
                                            <div className="sc-bczRLJ Row-sc-34df4f97-0 BagFooter__CurrencyInput-sc-8e61f205-8 hJYFVB pay-with hreuPu">
                                                <div
                                                    className="AssetLogo__LogoContainer-sc-c4f7aad2-3 Glgcn"
                                                    style={{ height: 24, width: 24 }}
                                                >
                                                    <div className="AssetLogo__LogoImageWrapper-sc-c4f7aad2-2 dzbfKw">
                                                        <img
                                                            src="data:image/png;base64,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"
                                                            alt="ETH logo"
                                                            className="AssetLogo__LogoImage-sc-c4f7aad2-1 fRmRFb"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text__TextWrapper-sc-b23cf51f-0 iPDTcg css-1ompv5d">
                                                    ETH
                                                </div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={20}
                                                    height={20}
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="#7D7D7D"
                                                    strokeWidth={2}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polyline points="6 9 12 15 18 9" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="Column-sc-72c388fb-0 BagFooter__TotalColumn-sc-8e61f205-4 fnQjPn jeiGFv">
                                            <div className="text__TextWrapper-sc-b23cf51f-0 gTElMf css-142zc9n">
                                                Total
                                            </div>
                                            <div className="text__TextWrapper-sc-b23cf51f-0 iPDTcg css-45h1g">
                                                {totalEth} ETH
                                            </div>
                                        </div>
                                    </div>
                                    <div className="sc-bczRLJ Row-sc-34df4f97-0 BagFooter__PriceImpactContainer-sc-8e61f205-11 hJYFVB pay-with broPIr">
                                        {/* <div className="text__TextWrapper-sc-b23cf51f-0 bmvmkq css-1a4qi6e">
                                            $48,313.44
                                        </div> */}
                                    </div>
                                </div>
                                <button
                                    data-testid="nft-buy-button"
                                    className="BagFooter__ActionButton-sc-8e61f205-9 KXFgS"
                                    // onClick={() => setShowConnectWallet(false)}
                                >
                                    Connect wallet
                                </button>
                            </div>
                        </div>)}
                </div>



            </div>

        </div>
        
    )
}

export default Cart;