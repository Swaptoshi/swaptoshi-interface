import React, { useState, useEffect } from 'react';
import './Nfts.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import { allTableDataETH, allTableDataUSD, slidersData } from '../../service/nfts';
import Cart from '../../components/Cart/Cart';
import { useNavigate } from 'react-router-dom';

const Nfts = ({
	isCartVisible,
	setIsCartVisible,
	allTableDataETH,
	allTableDataUSD,
	currency,
	setCurrency,
	data,
	setData,
	addToBag,
	setAddToBag,
	onAddToBagHandler,
	onRemoveBagItem,
}) => {
	const navigate = useNavigate();
	//Slider
	const settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		slidesToScroll: 1,
	};
	// Sliders Images
	const dataImage = [
		'https://i.seadn.io/gcs/files/0f98e562496514deec72096435a77eef.jpg',
		'https://i.seadn.io/gae/i5dYZRkVCUK97bfprQ3WXyrT9BnLSZtVKGJlKQ919uaUB0sxbngVCioaiyu9r6snqfi2aaTyIvv6DHm4m2R3y7hMajbsv14pSZK8mhs',
	];
	//tabs values
	const tabs = ['1D', '1W', '1M', 'All'];
	//currency tabs
	const currencyTabs = ['USD', 'ETH'];

	// Sorting header keys
	const [selectedTab, setSelectedTab] = useState('All');
	const [selectedCurrencyTab, setSelectedCurrencyTab] = useState('USD');
	const [tableData, setTableData] = useState([]);

	const [sortKey, setSortKey] = useState(null);
	const [sortDirection, setSortDirection] = useState('desc');

	//Table Header Div
	const sortData = key => {
		const sortedData = [...tableData];
		sortedData.sort((a, b) => {
			const valueA = typeof a[key] === 'number' ? a[key] : (a[key] || '').toString().toLowerCase();
			const valueB = typeof b[key] === 'number' ? b[key] : (b[key] || '').toString().toLowerCase();

			if (sortDirection === 'desc') {
				return valueA < valueB ? -1 : 1;
			} else {
				return valueA > valueB ? -1 : 1;
			}
		});
		setTableData(sortedData);
	};

	const handleColumnHeaderClick = key => {
		const direction = sortKey === key && sortDirection === 'desc' ? 'asc' : 'desc';
		setSortKey(key);
		setSortDirection(direction);
		sortData(key);
	};

	const handleTableClick = tab => {
		setSelectedTab(tab);
		const allTableData = selectedCurrencyTab === 'USD' ? allTableDataUSD : allTableDataETH;

		if (tab === 'All') {
			setTableData(allTableData);
		} else {
			const sortedData = sortDataByTime(allTableData, tab);
			setTableData(sortedData);
		}
	};

	const sortDataByTime = (data, timePeriod) => {
		let sortKey = '';
		switch (timePeriod) {
			case '1D':
				sortKey = 'volume';
				break;
			case '1W':
				sortKey = 'floor';
				break;
			case '1M':
				sortKey = 'floorChange';
				break;
			case 'All':
				sortKey = 'floor';
				break;
			default:
				sortKey = 'floor';
		}

		const sortedData = [...data];
		sortedData.sort((a, b) => parseFloat(b[sortKey]) - parseFloat(a[sortKey]));
		return sortedData;
	};

	const handleCurrencyTabClick = currencyTab => {
		setSelectedCurrencyTab(currencyTab);
		setCurrency(currencyTab);
	};
	useEffect(() => {
		handleTableClick(selectedTab);
	}, [selectedTab, selectedCurrencyTab]);

	//cart bag

	return (
		<React.Fragment>
			{isCartVisible && (
				<Cart
					setIsCartVisible={setIsCartVisible}
					setData={setData}
					addToBag={addToBag}
					setAddToBag={setAddToBag}
					onAddToBagHandler={onAddToBagHandler}
					onRemoveBagItem={onRemoveBagItem}
				/>
			)}
			<div className="bCNYil">
				<div className="btxSrH">
					<div className="dqagHG">
						<div className="cGylom fFOhEa" />
						<div className="kwQyZm">
							<div className=" hgUZSB">
								Better prices. <br />
								More listings.
							</div>
							{/* Slider */}
							<div className="sc-oqttp6-0 aYNfB">
								<div className="sc-oqttp6-1 jXnpsx">
									<Slider {...settings}>
										{/* Slider - One */}
										<div
											className="sc-oqttp6-2 fNoRxi slider1"
											style={{ transform: 'translate3d(-800px, 0px, 0px)' }}
										>
											<div className="sc-1j367rv-0 CvmCP">
												<div className="sc-1j367rv-15 iDTcds">
													<div src={dataImage[0]} className="sc-1j367rv-1 gZffhG">
														<div className="sc-1j367rv-3 dGnbgN">
															<img
																src="https://i.seadn.io/gcs/files/c6cb0b1d6f2ab61c0efacf00e62e2230.jpg?w=500&auto=format"
																className="sc-1j367rv-8 cOWUkP"
															/>
															<div className="sc-1j367rv-5 MiMiH">
																<div className="sc-sx9n2y-0 eaUeqv sc-1j367rv-16 ehquD css-68pfx3">
																	DeGods
																</div>
																<div className="sc-1j367rv-4 eUlOvo">
																	<svg
																		width="24px"
																		height="24px"
																		viewBox="0 0 20 20"
																		fill="none"
																		xmlns="http://www.w3.org/2000/svg"
																	>
																		<path
																			d="M4.52795 13.8056C4.52719 14.4043 4.6712 14.8474 4.95997 15.135C5.24798 15.4233 5.68496 15.5651 6.27091 15.5605H7.57497C7.62945 15.5585 7.68379 15.5676 7.73463 15.5873C7.78547 15.607 7.83176 15.6369 7.87062 15.6752L8.79884 16.5928C9.22054 17.0142 9.63382 17.2237 10.0387 17.2214C10.4436 17.2191 10.8569 17.0096 11.2786 16.5928L12.1954 15.6752C12.2356 15.6365 12.2832 15.6063 12.3354 15.5866C12.3876 15.5669 12.4433 15.558 12.499 15.5605H13.7951C14.3871 15.5613 14.8283 15.4171 15.1186 15.1281C15.4089 14.839 15.5541 14.3959 15.5541 13.7987V12.5014C15.5511 12.389 15.5923 12.2799 15.6687 12.1974L16.5854 11.2798C17.0125 10.86 17.2245 10.4467 17.2214 10.0399C17.2184 9.63305 17.0064 9.21935 16.5854 8.79878L15.6687 7.88115C15.592 7.79886 15.5509 7.68965 15.5541 7.57719V6.2799C15.5533 5.68191 15.4093 5.23878 15.1221 4.95049C14.8348 4.66221 14.3925 4.51806 13.7951 4.51806H12.499C12.4433 4.52036 12.3877 4.51138 12.3355 4.49168C12.2834 4.47197 12.2357 4.44193 12.1954 4.40336L11.2786 3.48574C10.8569 3.06439 10.4436 2.85487 10.0387 2.85717C9.63382 2.85946 9.22054 3.06898 8.79884 3.48574L7.87062 4.40336C7.83164 4.44148 7.78536 4.4713 7.73454 4.49101C7.68373 4.51072 7.62943 4.51993 7.57497 4.51806H6.27091C5.67961 4.51883 5.23995 4.66182 4.95194 4.94705C4.66393 5.23228 4.51992 5.67656 4.51992 6.2799V7.58063C4.52314 7.69309 4.48197 7.80229 4.40533 7.88459L3.48859 8.80222C3.06765 9.22203 2.85718 9.63572 2.85718 10.0433C2.85718 10.4509 3.07033 10.8653 3.49662 11.2867L4.41336 12.2043C4.48979 12.2867 4.53092 12.3958 4.52795 12.5083V13.8056Z"
																			fill="#FB118E"
																		/>
																		<path
																			d="M9.99737 12.4943C9.86205 12.7005 9.6623 12.8164 9.43032 12.8164C9.19191 12.8164 9.00504 12.7198 8.83106 12.4943L7.31036 10.6385C7.20082 10.5032 7.14282 10.3614 7.14282 10.2068C7.14282 9.88458 7.38768 9.63327 7.70342 9.63327C7.89673 9.63327 8.05138 9.70415 8.20603 9.90391L9.40455 11.4311L11.9498 7.34577C12.0851 7.12669 12.2591 7.02359 12.4524 7.02359C12.7553 7.02359 13.0388 7.23623 13.0388 7.55197C13.0388 7.70017 12.9615 7.85482 12.8777 7.99014L9.99737 12.4943Z"
																			fill="white"
																		/>
																	</svg>
																</div>
															</div>
														</div>
														<div className="sc-1j367rv-7 jYnXeS" />
													</div>
													<div className="sc-1j367rv-13 kJvxXp">
														<div className="sc-1j367rv-11 bZVieY active">
															<img
																src="/assets/images/logo/swaptoshi-logo.svg"
																style={{ width: '20px', height: '20px' }}
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 lvXBN css-1aekuku">Uniswap</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 lvXBN css-1aekuku">4.43 ETH Floor</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 lvXBN css-1aekuku">124 Listings</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<img
																src="/assets/images/opensea-grey.svg"
																alt="OpenSea icon"
																className="sc-1j367rv-14 cSkBzZ"
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">OpenSea</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">4.43 ETH</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">124</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<img
																src="/assets/images/x2y2-grey.svg"
																alt="X2Y2 icon"
																className="sc-1j367rv-14 cSkBzZ"
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">X2Y2</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">-</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">None</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<img
																src="/assets/images/looksrare-grey.svg"
																alt="LooksRare icon"
																className="sc-1j367rv-14 cSkBzZ"
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">LooksRare</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">-</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">None</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										{/* Slider - One - End */}

										{/* Slider - Two */}
										<div className="sc-oqttp6-2 fNoRxi slider2" style={{ transform: 'none' }}>
											<div className="sc-1j367rv-0 CvmCP">
												<div className="sc-1j367rv-15 iDTcds">
													<div src={dataImage[1]} className="sc-1j367rv-1 ZdTRI">
														<div className="sc-1j367rv-3 dGnbgN">
															<img
																src="https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?w=500&auto=format"
																className="sc-1j367rv-8 cOWUkP"
															/>
															<div className="sc-1j367rv-5 MiMiH">
																<div className="sc-sx9n2y-0 eaUeqv sc-1j367rv-16 ehquD css-68pfx3">
																	Bored Ape Yacht Club
																</div>
																<div className="sc-1j367rv-4 eUlOvo">
																	<img
																		src="/assets/images/verified-icon.png"
																		style={{ width: '20px', height: '20px' }}
																	/>
																</div>
															</div>
														</div>
														<div className="sc-1j367rv-7 jYnXeS" />
													</div>
													<div className="sc-1j367rv-13 kJvxXp">
														<div className="sc-1j367rv-11 bZVieY active">
															<img
																src="/assets/images/logo/swaptoshi-logo.svg"
																style={{ width: '20px', height: '20px' }}
															/>

															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 lvXBN css-1aekuku">Uniswap</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 lvXBN css-1aekuku">29.09 ETH Floor</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 lvXBN css-1aekuku">206 Listings</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<img
																src="/assets/images/opensea-grey.svg"
																alt="OpenSea icon"
																className="sc-1j367rv-14 cSkBzZ"
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">OpenSea</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">29.09 ETH</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">199</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<img
																src="/assets/images/x2y2-grey.svg"
																alt="X2Y2 icon"
																className="sc-1j367rv-14 cSkBzZ"
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">X2Y2</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">83.14 ETH</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">1</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<img
																src="/assets/images/looksrare-grey.svg"
																alt="LooksRare icon"
																className="sc-1j367rv-14 cSkBzZ"
															/>
															<div className="sc-1j367rv-12 fUSiEW">
																<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">LooksRare</div>
															</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">63.39 ETH</div>
														</div>
														<div className="sc-1j367rv-11 bZVieY">
															<div className="sc-sx9n2y-0 bftkTM css-zhpkf8">5</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										{/* Slider - Two - End */}
									</Slider>
								</div>
							</div>
						</div>
					</div>

					{/* Trending Nfts Tabs */}
					<div className="sc-1dnk851-0 yIDuG">
						<div className="sc-1dnk851-1 ebZEvI">Trending NFT collections</div>
						<div className="sc-1dnk851-2 dBfFrV">
							<div className="sc-1dnk851-3 eqMbma">
								{tabs.map((tab, index) => (
									<div
										className={`sc-1dnk851-4 bIvKIx ${selectedTab === tab ? 'active' : ''}`}
										key={index}
									>
										<div
											className="sc-sx9n2y-0 kivXvb sc-1dnk851-5 jURivN css-1w21yux"
											onClick={() => handleTableClick(tab)}
										>
											{tab}
										</div>
									</div>
								))}
							</div>
							{/* Trending Currency Nfts Tabs */}
							<div className="sc-1dnk851-3 eqMbma">
								{currencyTabs.map((cTab, index) => (
									<div
										className={`sc-1dnk851-4 currencyTabs  ${
											selectedCurrencyTab === cTab ? 'active' : ''
										}`}
									>
										<div
											className="sc-sx9n2y-0 kivXvb sc-1dnk851-5 jURivN css-1w21yux"
											key={index}
											onClick={() => handleCurrencyTabClick(cTab)}
										>
											{cTab}
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="sc-7yzmni-31 lngnkX">
							<table role="table" className="_1mor7vea rgw6ez4pd rgw6ez16v rgw6ez7bj rgw6ez7a7">
								<thead className="ntfs-t-head   rgw6ez7ar">
									<tr role="row">
										<th
											className="sc-iwpsza-3 gwMpjb _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											disabled=""
											style={{ textAlign: 'left', paddingLeft: 16 }}
										>
											<span className="_1klryar0 rgw6ez4bp rgw6ez491" />
											<span className="_1klryar0 rgw6ez2cp col-tab">Collection name</span>
										</th>
										<th
											className="sc-iwpsza-3 kSSCXd _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											title="Toggle SortBy"
											style={{ textAlign: 'right', paddingLeft: 0 }}
											onClick={() => handleColumnHeaderClick('floor')}
										>
											<span className="_1klryar0 rgw6ez4bp rgw6ez491" />
											{sortKey === 'floor' &&
												(sortDirection === 'desc' ? (
													<i className="ri-arrow-down-line"></i>
												) : (
													<i className="ri-arrow-up-line"></i>
												))}
											<span className="_1klryar0 rgw6ez2cp">Floor</span>
										</th>
										<th
											className="sc-iwpsza-3 kSSCXd _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											title="Toggle SortBy"
											style={{ textAlign: 'right', paddingLeft: 0 }}
											onClick={() => handleColumnHeaderClick('floorChange')}
										>
											{sortKey === 'floorChange' &&
												(sortDirection === 'desc' ? (
													<i className="ri-arrow-down-line"></i>
												) : (
													<i className="ri-arrow-up-line"></i>
												))}
											<span className="_1klryar0 rgw6ez4bp rgw6ez491" />

											<span className="_1klryar0 rgw6ez2cp floor-change-table">Floor change</span>
										</th>
										<th
											className="sc-iwpsza-3 kSSCXd _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											title="Toggle SortBy"
											style={{ textAlign: 'right', paddingLeft: 0 }}
											onClick={() => handleColumnHeaderClick('volume')}
										>
											{sortKey === 'volume' &&
												(sortDirection === 'desc' ? (
													<i className="ri-arrow-down-line"></i>
												) : (
													<i className="ri-arrow-up-line"></i>
												))}
											<span className="_1klryar0 rgw6ez2ed volume-table">Volume</span>
										</th>
										<th
											className="sc-iwpsza-3 kSSCXd _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											title="Toggle SortBy"
											style={{ textAlign: 'right', paddingLeft: 0 }}
											onClick={() => handleColumnHeaderClick('volumeChange')}
										>
											<span className="_1klryar0 rgw6ez4bp rgw6ez491" />
											{sortKey === 'volumeChange' &&
												(sortDirection === 'desc' ? (
													<i className="ri-arrow-down-line"></i>
												) : (
													<i className="ri-arrow-up-line"></i>
												))}
											<span className="_1klryar0 rgw6ez2cp volume-change-table">Volume change</span>
										</th>
										<th
											className="sc-iwpsza-3 kSSCXd _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											title="Toggle SortBy"
											style={{ textAlign: 'right', paddingLeft: 0 }}
											onClick={() => handleColumnHeaderClick('items')}
										>
											<span className="_1klryar0 rgw6ez4bp rgw6ez491" />
											{sortKey === 'items' &&
												(sortDirection === 'desc' ? (
													<i className="ri-arrow-down-line"></i>
												) : (
													<i className="ri-arrow-up-line"></i>
												))}
											<span className="_1klryar0 rgw6ez2cp items-table">Items</span>
										</th>
										<th
											className="sc-iwpsza-3 kSSCXd _1mor7ved rgw6ezcp rgw6ezav rgw6eze7 rgw6ez4ep rgw6ez2ov rgw6ez28d"
											colSpan={1}
											role="columnheader"
											title="Toggle SortBy"
											style={{ textAlign: 'right', paddingLeft: 0 }}
											onClick={() => handleColumnHeaderClick('owners')}
										>
											<span className="_1klryar0 rgw6ez4bp rgw6ez491" />
											{sortKey === 'owners' &&
												(sortDirection === 'desc' ? (
													<i className="ri-arrow-down-line"></i>
												) : (
													<i className="ri-arrow-up-line"></i>
												))}
											<span className="_1klryar0 rgw6ez2cp owner-table">Owners</span>
										</th>
									</tr>
								</thead>

								<tbody role="rowgroup">
									{tableData.map((item, index) => (
										<tr
											role="row"
											onClick={() => navigate(`/nfts/${item.id}?currency=${selectedCurrencyTab}`)}
											data-testid="nft-trending-collection"
											className="sc-iwpsza-1 dbIfpX"
										>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491"
												role="cell"
												style={{ maxWidth: 360 }}
											>
												<div className="sc-iwpsza-0 jNQukZ">
													<div className="sc-sx9n2y-0 bftkTM css-1cjl26j">{index + 1}</div>
													<div className="sc-1qdt28z-0 sc-1qdt28z-1 iQoJCd haocDl">
														<img src={item.image} className="sc-1qdt28z-5 fPJsfG" />
														<div className="sc-1qdt28z-0 sc-1qdt28z-2 iQoJCd dOdauD">
															<div className="sc-sx9n2y-0 kivXvb sc-1qdt28z-3 FYrkO css-rjqme">
																{item.title}
															</div>
														</div>
														<span className="rgw6ezl7 rgw6ez457 rgw6ez2o7 rgw6ez19v rgw6ez12v rgw6ez461">
															<svg
																width={20}
																height={20}
																viewBox="0 0 20 20"
																fill="none"
																xmlns="http://www.w3.org/2000/svg"
															>
																<path
																	d="M4.52795 13.8056C4.52719 14.4043 4.6712 14.8474 4.95997 15.135C5.24798 15.4233 5.68496 15.5651 6.27091 15.5605H7.57497C7.62945 15.5585 7.68379 15.5676 7.73463 15.5873C7.78547 15.607 7.83176 15.6369 7.87062 15.6752L8.79884 16.5928C9.22054 17.0142 9.63382 17.2237 10.0387 17.2214C10.4436 17.2191 10.8569 17.0096 11.2786 16.5928L12.1954 15.6752C12.2356 15.6365 12.2832 15.6063 12.3354 15.5866C12.3876 15.5669 12.4433 15.558 12.499 15.5605H13.7951C14.3871 15.5613 14.8283 15.4171 15.1186 15.1281C15.4089 14.839 15.5541 14.3959 15.5541 13.7987V12.5014C15.5511 12.389 15.5923 12.2799 15.6687 12.1974L16.5854 11.2798C17.0125 10.86 17.2245 10.4467 17.2214 10.0399C17.2184 9.63305 17.0064 9.21935 16.5854 8.79878L15.6687 7.88115C15.592 7.79886 15.5509 7.68965 15.5541 7.57719V6.2799C15.5533 5.68191 15.4093 5.23878 15.1221 4.95049C14.8348 4.66221 14.3925 4.51806 13.7951 4.51806H12.499C12.4433 4.52036 12.3877 4.51138 12.3355 4.49168C12.2834 4.47197 12.2357 4.44193 12.1954 4.40336L11.2786 3.48574C10.8569 3.06439 10.4436 2.85487 10.0387 2.85717C9.63382 2.85946 9.22054 3.06898 8.79884 3.48574L7.87062 4.40336C7.83164 4.44148 7.78536 4.4713 7.73454 4.49101C7.68373 4.51072 7.62943 4.51993 7.57497 4.51806H6.27091C5.67961 4.51883 5.23995 4.66182 4.95194 4.94705C4.66393 5.23228 4.51992 5.67656 4.51992 6.2799V7.58063C4.52314 7.69309 4.48197 7.80229 4.40533 7.88459L3.48859 8.80222C3.06765 9.22203 2.85718 9.63572 2.85718 10.0433C2.85718 10.4509 3.07033 10.8653 3.49662 11.2867L4.41336 12.2043C4.48979 12.2867 4.53092 12.3958 4.52795 12.5083V13.8056Z"
																	fill="#FB118E"
																/>
																<path
																	d="M9.99737 12.4943C9.86205 12.7005 9.6623 12.8164 9.43032 12.8164C9.19191 12.8164 9.00504 12.7198 8.83106 12.4943L7.31036 10.6385C7.20082 10.5032 7.14282 10.3614 7.14282 10.2068C7.14282 9.88458 7.38768 9.63327 7.70342 9.63327C7.89673 9.63327 8.05138 9.70415 8.20603 9.90391L9.40455 11.4311L11.9498 7.34577C12.0851 7.12669 12.2591 7.02359 12.4524 7.02359C12.7553 7.02359 13.0388 7.23623 13.0388 7.55197C13.0388 7.70017 12.9615 7.85482 12.8777 7.99014L9.99737 12.4943Z"
																	fill="white"
																/>
															</svg>
														</span>
													</div>
												</div>
											</td>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491"
												role="cell"
												style={{ maxWidth: 160 }}
											>
												<div className="sc-1qdt28z-7 eCRqrV">
													<div className="sc-sx9n2y-0 kivXvb css-1jljtub floor-table">
														{selectedCurrencyTab === 'USD'
															? `$${item.floor.toLocaleString()}`
															: `${item.floor} ETH`}
													</div>
												</div>
											</td>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491"
												role="cell"
												style={{ maxWidth: 160 }}
											>
												<div className="sc-1qdt28z-6 glsCXl">
													<i className="ri-arrow-right-down-line"></i>
													<div className="sc-sx9n2y-0 kandXm css-1jljtub floor-change-table">
														{selectedCurrencyTab === 'USD'
															? `${item.floorChange}%`
															: `${item.floorChange}%`}
													</div>
												</div>
											</td>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491"
												role="cell"
												style={{ maxWidth: 160 }}
											>
												<div className="sc-1qdt28z-7 eCRqrV">
													<div className="sc-sx9n2y-0 kivXvb css-1jljtub volume-table">
														{/* 4,505 ETH */}
														{selectedCurrencyTab === 'USD'
															? `$${item.volume.toLocaleString()}`
															: `${item.volume.toLocaleString()} ETH`}
													</div>
												</div>
											</td>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491 volume-change-table"
												role="cell"
												style={{ maxWidth: 160 }}
											>
												<div className="sc-1qdt28z-6 bGFXDY">
													<svg
														width="20px"
														height="20px"
														viewBox="0 0 16 16"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M4.66797 11.3334L11.3346 4.66671M11.3346 4.66671V11.3334M11.3346 4.66671H4.66797"
															stroke="currentColor"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
													<div className="sc-sx9n2y-0 kandXm css-1jljtub volume-change-table">
														{selectedCurrencyTab === 'USD'
															? `${item.volumeChange}%`
															: `${item.volumeChange}%`}
													</div>
												</div>
											</td>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491"
												role="cell"
												style={{ maxWidth: 160 }}
											>
												<span className="items-table">
													{/* 8.9K */}
													{selectedCurrencyTab === 'USD' ? `${item.items}K` : `${item.items}K`}
												</span>
											</td>
											<td
												className="_1mor7vef rgw6ezcp rgw6ezb1 rgw6ezed rgw6ez2o7 rgw6ez27p rgw6ez1jp rgw6ez467 rgw6ez491"
												role="cell"
												style={{ maxWidth: 160 }}
											>
												<span className="owner-table">
													{/* 2.4K */}
													{selectedCurrencyTab === 'USD' ? `${item.owners}K` : `${item.owners}K`}
												</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Nfts;
