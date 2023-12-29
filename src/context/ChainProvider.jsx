import React from 'react';
import { checkServiceNode } from '../service/node';
import { getBlockchainApps } from '../service/apps';
import { tryToast } from '../utils/toast/tryToast';
import { liskTokenCompact } from '../utils/constants/tokens';
import { getDEXConfig } from '../service/dex';
import * as env from '../utils/config/env';

const ChainContext = React.createContext();

export function useChain() {
	return React.useContext(ChainContext);
}

export default function ChainProvider({ children }) {
	const [chain, setChain] = React.useState(env.DEFAULT_CHAIN);
	const [dexConfig, setDexConfig] = React.useState();
	const [availableService, setAvailableService] = React.useState();
	const [selectedService, setSelectedService] = React.useState();
	const [lskTokenInfo, setLskTokenInfo] = React.useState(liskTokenCompact);

	const fetchBlock = React.useRef(false);

	const fetchDexConfig = React.useCallback(async service => {
		const config = await getDEXConfig(service);
		setDexConfig(config.data);
	}, []);

	React.useEffect(() => {
		setLskTokenInfo(s => ({
			...s,
			tokenId: chain.concat('0'.repeat(14)),
		}));
	}, [chain]);

	React.useEffect(() => {
		if (!availableService) return;
		for (let i = 0; i < availableService.length; i++) {
			if (availableService[i].chainID.substring(0, 2) === chain) {
				setSelectedService(availableService[i]);
				break;
			}
		}
	}, [availableService, chain]);

	React.useEffect(() => {
		const run = async () => {
			if (fetchBlock.current) return;
			fetchBlock.current = true;

			const fetchedService = [];
			const swaptoshiMetadata = await getBlockchainApps();

			if (swaptoshiMetadata && swaptoshiMetadata.data) {
				for (const metadata of swaptoshiMetadata.data) {
					const service = {
						chainID: metadata.chainID,
						networkType: metadata.networkType,
						serviceURLs: '',
					};
					for (let i = 0; i < metadata.serviceURLs.length; i++) {
						if (await checkServiceNode(metadata.serviceURLs[i].http)) {
							service.serviceURLs = metadata.serviceURLs[i].http;
							break;
						}
					}
					fetchedService.push(service);
				}
			}

			setAvailableService(fetchedService);

			let selectedIndex = -1;
			for (let i = 0; i < fetchedService.length; i++) {
				if (fetchedService[i].chainID.substring(0, 2) === env.DEFAULT_CHAIN) {
					setSelectedService(fetchedService[i]);
					selectedIndex = i;
					break;
				}
			}

			if (selectedIndex >= 0) {
				fetchDexConfig(fetchedService[selectedIndex].serviceURLs);
			}

			fetchBlock.current = false;
		};

		tryToast('Fetch chain information failed', run, () => (fetchBlock.current = false));
	}, [fetchDexConfig]);

	const context = React.useMemo(
		() => ({
			chain,
			setChain,
			availableService,
			selectedService,
			setSelectedService,
			lskTokenInfo,
			dexConfig,
		}),
		[availableService, chain, dexConfig, lskTokenInfo, selectedService],
	);

	return <ChainContext.Provider value={context}>{children}</ChainContext.Provider>;
}
