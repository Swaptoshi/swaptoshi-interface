const networkToIconMap = {
	devnet: '/assets/images/swaptoshi-network/swaptoshi-devnet.png',
	testnet: '/assets/images/swaptoshi-network/swaptoshi-testnet.png',
	mainnet: '/assets/images/swaptoshi-network/swaptoshi-mainnet.png',
};

export function getSwaptoshiIcon(network) {
	const icon = networkToIconMap[network];
	return icon ? icon : '/assets/images/swaptoshi-network/swaptoshi-unknown.png';
}
