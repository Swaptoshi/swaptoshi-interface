import React, { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import './TokenPickerModal.css';
import Loader from '../Loader/Loader';
import { getDEXTokenCompact } from '../../service/dex';
import { useChain } from '../../context/ChainProvider';
import { tryToast } from '../../utils/Toast/tryToast';

const TokenPicker = ({ mode, show, onClose, selected, onSelect }) => {
	const { selectedService } = useChain();

	const [data, setData] = useState();
	const [total, setTotal] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState();

	const [searchTerm, setSearchTerm] = useState('');
	const [searchResult, setSearchResult] = useState();
	const [searchTotal, setSearchTotal] = useState();
	const [isSearching, setIsSearching] = useState(false);
	const [searchError, setSearchError] = useState();

	const withPaginationNormal = React.useMemo(() => total && data.length < total, [data, total]);
	const withPaginationSearch = React.useMemo(
		() => searchTotal && searchResult.length < searchTotal,
		[searchResult, searchTotal],
	);

	const search = useDebouncedCallback(async e => {
		setSearchTerm(e.target.value);
		await tryToast(
			async () => {
				const nextSearch = await getDEXTokenCompact(
					{ search: e.target.value },
					selectedService.serviceURLs,
				);
				if (nextSearch && nextSearch.data && nextSearch.meta) {
					if (nextSearch.data.length === 0) {
						setSearchError('No tradable tokens found');
					} else {
						setSearchResult(nextSearch.data);
						setSearchTotal(nextSearch.meta);
					}
				}
			},
			err => setSearchError(err.message),
			() => setIsSearching(false),
		);
	}, 500);

	const handleTokenChange = React.useCallback(
		e => {
			if (e.target.value.length > 0) {
				setIsSearching(true);
				search(e);
			} else {
				setIsSearching(false);
				setSearchTerm('');
				setSearchError();
			}
		},
		[search],
	);

	const handleScrollEnd = useDebouncedCallback(async () => {
		if (mode === 'tradable' && searchTerm.length === 0 && withPaginationNormal) {
			tryToast(
				async () => {
					const nextTradableToken = await getDEXTokenCompact(
						{ offset: data.length },
						selectedService.serviceURLs,
					);
					if (nextTradableToken && nextTradableToken.data && nextTradableToken.meta) {
						setData(data.concat(nextTradableToken.data));
					}
				},
				err => setError(err.message),
			);
		}

		if (mode === 'tradable' && searchTerm.length > 0 && withPaginationSearch) {
			tryToast(
				async () => {
					const nextSearch = await getDEXTokenCompact(
						{ search: searchTerm, offset: searchResult.length },
						selectedService.serviceURLs,
					);
					if (nextSearch && nextSearch.data && nextSearch.meta) {
						setSearchResult(searchResult.concat(nextSearch.data));
					}
				},
				err => setSearchError(err.message),
			);
		}
	}, 500);

	const handleScroll = React.useCallback(
		e => {
			if (
				(searchTerm.length === 0 && withPaginationNormal) ||
				(searchTerm.length > 0 && withPaginationSearch)
			) {
				const isNearBottom =
					e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 10;
				if (isNearBottom) {
					handleScrollEnd();
				}
			}
		},
		[handleScrollEnd, searchTerm, withPaginationNormal, withPaginationSearch],
	);

	React.useEffect(() => {
		if (!selectedService) return;

		const run = async () => {
			setIsLoading(true);

			if (mode === 'tradable') {
				const tradableToken = await getDEXTokenCompact({}, selectedService.serviceURLs);
				if (tradableToken && tradableToken.data && tradableToken.meta) {
					setData(tradableToken.data);
					setTotal(tradableToken.meta.total);
				}
			}

			// TODO: wallet
		};

		tryToast(
			run,
			err => setError(err.message),
			() => setIsLoading(false),
		);
	}, [mode, selectedService]);

	const tokenDataMapper = React.useCallback(
		(tokens, loader) => {
			return (
				<>
					{tokens.map(item => (
						<div
							key={item.tokenId}
							tabIndex={0}
							className={`hJYFVB fhPvJeh frnZMKK edPdrxe token-item-ETHER ${
								selected?.tokenId === item.tokenId ? 'active ' : ''
							}`}
							disabled=""
							onClick={() => onSelect(item)}
						>
							<div className="sc-1kykgp9-0 iCxowP">
								<div className="sc-12k1pn4-3 eLvYRk" style={{ opacity: 1 }}>
									<div className="sc-12k1pn4-2 oJGcu">
										<img src={item.logo} alt="Token logo" className="sc-12k1pn4-1 gxjzue" />
									</div>
								</div>
							</div>
							<div className="sc-1kykgp9-2 jdTKGL" style={{ opacity: 1 }}>
								<div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB fhPvJeh">
									<div title={item.tokenName} className="sc-1e2o00j-2 dmGdpm css-vurnku">
										{item.tokenName}
									</div>
									<div className="sc-1e2o00j-4 wHspX" />
								</div>
								<div className="sc-sx9n2y-0 bqwbXT css-yfjwjl">{item.symbol}</div>
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
								{selected?.tokenId === item.tokenId && <i className="swap-tick ri-check-line"></i>}
							</div>
						</div>
					))}
					{loader ? (
						<div
							style={{
								width: '100%',
								height: '32px',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								margin: '16px 0',
							}}
						>
							<Loader size={30} />
						</div>
					) : null}
				</>
			);
		},
		[onSelect, selected],
	);

	const renderTokenList = React.useCallback(() => {
		if (isSearching || isLoading || data === undefined) {
			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Loader size={40} />
				</div>
			);
		}

		if (searchError !== undefined || error !== undefined) {
			return (
				<div
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					{searchError ? searchError : error}
				</div>
			);
		}

		if (searchTerm.length === 0) {
			return tokenDataMapper(data, withPaginationNormal);
		}

		if (searchTerm.length > 0) {
			return tokenDataMapper(searchResult, withPaginationSearch);
		}
	}, [
		data,
		error,
		isLoading,
		isSearching,
		searchError,
		searchResult,
		searchTerm,
		tokenDataMapper,
		withPaginationNormal,
		withPaginationSearch,
	]);

	return (
		<div>
			<div
				className={`sc-jajvtp-0 bmYGet`}
				data-reach-dialog-overlay=""
				style={{ display: show ? 'flex' : 'none' }}
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
								<div className="css-xy7yfl">
									{mode === 'tradable' ? 'Select token from market' : 'Select token from wallet'}
								</div>
								<span onClick={onClose}>
									<i
										className="close-modal ri-close-line hover-shadow"
										style={{ borderRadius: 16, overflow: 'hidden' }}
									></i>
								</span>
							</div>
							<div className="sc-bczRLJ sc-nrd8cx-0 hJYFVB fhPvJeh">
								<input
									type="text"
									id="token-search-input"
									data-testid="token-search-input"
									placeholder="Search by name, symbol, or token id"
									autoComplete="off"
									className="sc-1xp9ndq-2 hxoNas"
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
										onScroll={handleScroll}
									>
										{renderTokenList()}
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

export default TokenPicker;
