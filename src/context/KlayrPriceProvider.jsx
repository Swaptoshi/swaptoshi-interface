import React from 'react';
import { useChain } from './ChainProvider';
import { getKlayrMarket } from '../service/market';
import { tryToast } from '../utils/toast/tryToast';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../utils/config/env';

const KlayrPriceContext = React.createContext();

export function useKlayrPrice() {
	return React.useContext(KlayrPriceContext);
}

export default function KlayrPriceProvider({ children }) {
	const [prices, setPrices] = React.useState();
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

	const fetchPrice = useDebouncedCallback(async () => {
		const run = async () => {
			if (selectedService) {
				const market = await getKlayrMarket(
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (market && market.data && market.data.length > 0) {
					const price = market.data.find(t => t.from === 'KLY' && t.to === currency.toUpperCase());
					if (!price) setPrices(0);
					else setPrices(parseFloat(price.rate));
				}
			}
		};

		tryToast('Fetch KLY/USD price failed', run);
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		fetchPrice();
		const updateKlayrPriceInterval = setInterval(fetchPrice, Number(env.KLYUSD_UPDATE_INTERVAL_MS));

		return () => {
			clearInterval(updateKlayrPriceInterval);
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

	return <KlayrPriceContext.Provider value={context}>{children}</KlayrPriceContext.Provider>;
}
