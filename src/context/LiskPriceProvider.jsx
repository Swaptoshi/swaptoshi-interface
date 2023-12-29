import React from 'react';
import { useChain } from './ChainProvider';
import { getLiskMarket } from '../service/market';
import { tryToast } from '../utils/toast/tryToast';
import { useDebouncedCallback } from 'use-debounce';

const LiskPriceContext = React.createContext();

export function useLiskPrice() {
	return React.useContext(LiskPriceContext);
}

export default function LiskPriceProvider({ children }) {
	const [prices, setPrices] = React.useState([]);
	const [fiatFormatter, setFiatFormatter] = React.useState();
	const [compactFiatFormatter, setCompactFiatFormatter] = React.useState();
	const [cryptoFormatter, setCryptoFormatter] = React.useState();
	const [currency, setCurrency] = React.useState('USD');
	const { selectedService } = useChain();

	React.useEffect(() => {
		setFiatFormatter(
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: currency,
				maximumFractionDigits: 20,
			}),
		);
		setCompactFiatFormatter(
			new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: currency,
				maximumFractionDigits: 2,
				notation: 'compact',
			}),
		);
		setCryptoFormatter(new Intl.NumberFormat(undefined, { maximumFractionDigits: 20 }));
	}, [currency]);

	const fetchPrice = useDebouncedCallback(
		async () => {
			const run = async () => {
				if (selectedService) {
					const market = await getLiskMarket(
						selectedService ? selectedService.serviceURLs : undefined,
					);
					if (market && market.data && market.data.length > 0) {
						const price = market.data.find(
							t => t.from === 'LSK' && t.to === currency.toUpperCase(),
						);
						if (!price) setPrices(0);
						else setPrices(Number(price.rate));
					}
				}
			};

			tryToast('Fetch LSK/USD price failed', run);
		},
		Number(process.env.REACT_APP_EFFECT_DEBOUNCE_WAIT ?? 500),
	);

	React.useEffect(() => {
		fetchPrice();
		const updateLiskPriceInterval = setInterval(fetchPrice, 60000);

		return () => {
			clearInterval(updateLiskPriceInterval);
		};
	}, [currency, fetchPrice, selectedService]);

	const context = React.useMemo(
		() => ({
			prices,
			setPrices,
			currency,
			setCurrency,
			compactFiatFormatter,
			fiatFormatter,
			cryptoFormatter,
		}),
		[compactFiatFormatter, cryptoFormatter, currency, fiatFormatter, prices],
	);

	return <LiskPriceContext.Provider value={context}>{children}</LiskPriceContext.Provider>;
}
