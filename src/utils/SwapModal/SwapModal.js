import React, { useState } from 'react';
import './SwapModal.css';

const SwapModal = ({
	swapModal,
	setSwapModal,
	swapTokens,
	selectedToken,
	handleSelect,
	isLiquidity = false,
}) => {
	const [searchTerm, setSearchTerm] = useState('');

	const handleTokenChange = e => {
		setSearchTerm(e.target.value);
	};

	const filteredTokenSearch = swapTokens?.filter(token =>
		token.label.toLowerCase().includes(searchTerm.toLowerCase()),
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
							<div
								id="cross-title"
								className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-1 hJYFVB fhPvJeh frnZMKK"
							>
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
						</div>
						<div className="sc-1xp9ndq-3 cbqHzZ" />
						<div style={{ flex: '1 1 0%', position: 'relative', height: '100px' }}>
							<div style={{ height: '100%' }}>
								<div
									data-testid="currency-list-wrapper"
									className="sc-1e2o00j-5"
									style={{ height: '100%' }}
								>
									<div
										className="_1pi21y70"
										style={{
											height: '100%',
											overflow: 'auto',
											scrollbarGutter: 'auto',
											paddingTop: '4px',
										}}
									>
										{filteredTokenSearch?.map(item => (
											<div
												key={item.id}
												tabIndex={0}
												className={`hJYFVB fhPvJeh frnZMKK edPdrxe token-item-ETHER ${
													selectedToken?.label === item?.label ? 'active ' : ''
												}`}
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
														<div title={item?.label} className="sc-1e2o00j-2 dmGdpm css-vurnku">
															{item?.label}
														</div>
														<div className="sc-1e2o00j-4 wHspX" />
													</div>
													<div className="sc-sx9n2y-0 bqwbXT css-yfjwjl">{item?.symbol}</div>
												</div>
												<div className="sc-1kykgp9-0 iCxowP">
													<div
														className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
														style={{ justifySelf: 'flex-end' }}
													/>
												</div>
												<div
													className="sc-bczRLJ sc-nrd8cx-0 sc-nrd8cx-4 hJYFVB fhPvJeh leSroW"
													style={{ justifySelf: 'flex-end' }}
												>
													{selectedToken?.label === item?.label && (
														<i className="swap-tick ri-check-line"></i>
													)}
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
							<div className="resize-triggers">
								<div className="expand-trigger">
									<div style={{ width: 419, height: 345 }} />
								</div>
								<div className="contract-trigger" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SwapModal;
