import React, { useState, useEffect } from 'react';
import './Token.css';
import { Link, NavLink } from 'react-router-dom';
import PrimaryButton from '../../components/Button/PrimaryButton';

const Token = ({ allTableData, updateTime, options }) => {
	const [sortBy, setSortBy] = useState(null);
	const [sortOrder, setSortOrder] = useState('desc');

	const [selectedOption, setSelectedOption] = useState(options[0]);
	const [updateOption, setUpdateOption] = useState(updateTime[1]);
	const [isOpen, setIsOpen] = useState(false);
	const [handleOpen, setHandleOpen] = useState(false);

	const [filteredTableData, setFilteredTableData] = useState(allTableData);

	const sortData = criteria => {
		const newSortOrder = sortBy === criteria && sortOrder === 'asc' ? 'desc' : 'asc';
		setSortBy(criteria);
		setSortOrder(newSortOrder);

		const sortedData = [...allTableData].sort((a, b) => {
			const aValue = a[criteria];
			const bValue = b[criteria];

			if (newSortOrder === 'asc') {
				return aValue - bValue;
			} else {
				return bValue - aValue;
			}
		});

		setFilteredTableData(sortedData);
	};

	const handleCryptoOpen = () => {
		setIsOpen(!isOpen);
		setHandleOpen(false);
	};

	const handleUpdateOpen = () => {
		setHandleOpen(!handleOpen);
		setIsOpen(false);
	};
	useEffect(() => {
		const filteredData = allTableData.filter(data => data.label === selectedOption.label);

		setFilteredTableData(filteredData);
	}, [selectedOption]);

	function determineTrendIcon(current, old) {
		if (current > old) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		} else if (current < old) {
			return (
				<i
					style={{ color: 'rgb(252, 83, 83)' }}
					className="trends-down-icon ri-arrow-right-down-line"
				></i>
			);
		} else if (current === old) {
			return (
				<i
					style={{ color: 'rgb(118, 209, 145)' }}
					className="trends-up-icon ri-arrow-right-up-line"
				></i>
			);
		}
		return null;
	}

	//Calculate Search `dropdown` rates
	function calculatePercentChange(current, old) {
		return Math.abs(((current - old) / old) * 100);
	}

	return (
		<React.Fragment>
			<div className="token-wrapper">
				<div className="token-container">
					<div className="token-title-wrapper">
						<div className="token-title">
							<p>Top tokens on Uniswap</p>
						</div>
					</div>

					<div className="filter-wrapper">
						<div className="filter-dropdowns">
							<div className="crypto-currency-drop">
								{/* token-btn */}
								<button id="crypto-btn " className="me-2" onClick={handleCryptoOpen}>
									<div className="crypto-btn-content">
										<div className="text-and-img">
											<img src={selectedOption.imgSrc} alt="selected-crypto-icon" />
											{selectedOption.label}
										</div>
										<span className={`icon-drop ${isOpen ? 'rotated' : ''}`}>
											<i className="ri-arrow-down-s-line"></i>
										</span>
									</div>
								</button>

								{/* token-btn dropdown */}
								{isOpen && (
									<ul className="dropdown-items-wrapper">
										{options.map(option => (
											<li id="dropdownItem" className="dropdown-item" key={Math.random()}>
												<div
													className="item-crypto"
													onClick={() => {
														setSelectedOption(option);
														setIsOpen(false);
													}}
												>
													<img src={option.imgSrc} />
													{option.label}
												</div>
												<div className="">
													{selectedOption.value === option.value && (
														<i className="tick-icon ri-check-line"></i>
													)}
												</div>
											</li>
										))}
									</ul>
								)}

								{/* token update button */}
								<div className="token-update">
									<button id="updateBtn" className="update-btn" onClick={handleUpdateOpen}>
										<div className="token-update-text">
											{updateOption.label}
											<span className={`icon-drop ${handleOpen ? 'rotated' : ''}`}>
												<i className="ri-arrow-down-s-line"></i>
											</span>
										</div>
									</button>

									{/* //token update button dropdown */}
									{handleOpen && (
										<ul className="igfebL">
											{updateTime.map(op => (
												<li id="" className="chstga iCcgEc" key={op.value}>
													<div
														className=""
														onClick={() => {
															setUpdateOption(op);
															setHandleOpen(false);
														}}
													>
														{op.label}
													</div>
													<div className="">
														{updateOption.value === op.value && (
															<i className="tick-icon ri-check-line"></i>
														)}
													</div>
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
							<div
								style={{
									justifyContent: 'end',
									width: '100%',
									display: 'flex',
								}}
							>
								<NavLink
									className="hide-below-375 show-below-720 hide-above-720"
									to="/create-token"
								>
									<PrimaryButton style={{ width: '130px' }}>Create Token</PrimaryButton>
								</NavLink>

								<NavLink className="show-below-375 hide-above-375" to="/create-token">
									<PrimaryButton style={{ width: '60px' }}>+</PrimaryButton>
								</NavLink>
							</div>
						</div>
						<div id="tokenInputWrapper" className="token-input-wrapper">
							<div className="">
								<input
									data-cy="explore-tokens-search-input"
									type="search"
									placeholder="Filter tokens"
									id="searchBar"
									autoComplete="off"
									className="token-input"
									defaultValue=""
								/>
							</div>
						</div>

						<NavLink className="hide-below-720" to="/create-token">
							<PrimaryButton style={{ width: '200px' }}>Create Token</PrimaryButton>
						</NavLink>
					</div>

					{/* Data Head  */}
					<div className="sc-19z0ycm-0 frDKYg">
						<div
							data-testid="header-row"
							id="giptel"
							className="sc-1bit9h6-1 sc-1bit9h6-4 fTDqns  "
						>
							<div className="sc-1bit9h6-0 sc-1bit9h6-5 hJyIyF bwVaNf">#</div>
							<div data-testid="name-cell" className="sc-1bit9h6-0 sc-1bit9h6-8 hJyIyF fLXlBW">
								Token name
							</div>
							<div
								data-testid="price-cell"
								className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-9 hJyIyF knzTRi igka-dA"
							>
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('price')}>Price</div>
									{sortBy === 'price' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
							<div
								data-testid="percent-change-cell"
								className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-10 hJyIyF knzTRi fLOBMM"
							>
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('oldPrice')}>Change</div>
									{sortBy === 'oldPrice' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
							<div
								data-testid="tvl-cell"
								id="hwCfxy"
								className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-7 hJyIyF knzTRi fLGPoq"
							>
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('tvl')}>TVL</div>
									{sortBy === 'tvl' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
							<div id="volume-celll" data-testid="volume-cell" className="hJyIyF knzTRi gEaRbj">
								<span className="sc-1bit9h6-13 jxjqhR">
									<div onClick={() => sortData('volume')}>Volume</div>
									{sortBy === 'volume' && (
										<div className="sc-d5tbhs-1 cSretk">
											<div>
												<div className="sc-1bit9h6-26 bcYQwk">
													{sortOrder === 'asc' ? (
														<i className="drop-ico ri-arrow-up-line"></i>
													) : (
														<i className="drop-ico ri-arrow-down-line"></i>
													)}
												</div>
											</div>
										</div>
									)}
								</span>
							</div>
						</div>

						{/* Data Body */}
						<div className="sc-19z0ycm-1 ejgNi">
							{filteredTableData.map((data, index) => (
								<div key={data.id} data-testid="token-table-row-NATIVE">
									<Link className="sc-1bit9h6-16 kiPA-dv" to={`/tokens/${data.id}`}>
										<div className="sc-1bit9h6-1 cQmpaP">
											<div className="sc-1bit9h6-0 sc-1bit9h6-5 hJyIyF bwVaNf">{index + 1}</div>
											<div
												data-testid="name-cell"
												className="sc-1bit9h6-0 sc-1bit9h6-8 hJyIyF fLXlBW"
											>
												<div className="sc-1bit9h6-2 sc-1bit9h6-3 bvHTKj jqxpYK">
													<div className="sc-12k1pn4-3 eLvYRk">
														<div className="sc-12k1pn4-2 ckpBIe">
															<img
																src={data.image}
																alt="Token logo"
																className="sc-12k1pn4-1 bwVixy"
															/>
														</div>
														<div className="sc-12k1pn4-4 epsCee" />
													</div>
													<div className="sc-1bit9h6-0 sc-1bit9h6-17 hJyIyF gKCxsP">
														<div data-cy="token-name" className="sc-1bit9h6-18 kSNzln">
															{data.name}
														</div>
														<div className="sc-1bit9h6-0 sc-1bit9h6-19 hJyIyF jRVRlR">
															{data.symbol}
														</div>
													</div>
												</div>
											</div>
											<div
												data-testid="price-cell"
												className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-9 hJyIyF dQscKx igka-dA"
											>
												<div className="sc-1bit9h6-2 bvHTKj">
													<div className="sc-1bit9h6-0 sc-1bit9h6-12 hJyIyF eNYLXF">
														{`$${data.price.toFixed(2)}`}
														<div className="sc-1bit9h6-0 sc-1bit9h6-11 hJyIyF iQNhmM">
															<div className="sc-1nu6e54-7 cLYUzV"></div>
														</div>
													</div>
												</div>
											</div>
											<div
												data-testid="percent-change-cell"
												className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-10 hJyIyF dQscKx fLOBMM"
											>
												<div className="sc-1bit9h6-2 bvHTKj">
													<div className="sc-1nu6e54-7 cLYUzV"></div>
													<span className="sc-1nu6e54-2 braSjM">
														<span>{determineTrendIcon(data.price, data.oldPrice)}</span>
														<span
															className=""
															style={{
																color:
																	data.price > data.oldPrice
																		? 'rgb(118, 209, 145)'
																		: data.price === data.oldPrice
																			? 'rgb(118, 209, 145)'
																			: 'rgb(252, 83, 83)',
															}}
														>
															<span>
																{calculatePercentChange(data.price, data.oldPrice).toFixed(2)}%
															</span>
														</span>
													</span>
												</div>
											</div>
											<div
												data-testid="tvl-cell"
												className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-7 hJyIyF dQscKx fLGPoq"
											>
												<div className="sc-1bit9h6-2 bvHTKj">{`$${data.tvl}`}</div>
											</div>
											<div
												data-testid="volume-cell"
												className="sc-1bit9h6-0 sc-1bit9h6-6 sc-1bit9h6-20 hJyIyF dQscKx gEaRbj"
											>
												<div className="sc-1bit9h6-2 bvHTKj">{`$${data.volume}`}</div>
											</div>
											<div className="sc-1bit9h6-0 sc-1bit9h6-14 hJyIyF NpKpm">
												<div className="sc-1bit9h6-0 sc-1bit9h6-15 hJyIyF FLymZ">
													<div style={{ width: '100%', height: '100%' }}>graph-img</div>
												</div>
											</div>
										</div>
									</Link>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};
export default Token;
