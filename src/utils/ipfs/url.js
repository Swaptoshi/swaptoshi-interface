export const getIPFSUrl = uri => {
	const url = new URL(uri);
	return `https:${url.pathname}.ipfs.nftstorage.link/`;
};
