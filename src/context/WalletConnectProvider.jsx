import React, { useContext } from 'react';
import { Buffer } from 'buffer';
import { SignClient } from '@walletconnect/sign-client';
import { useChain } from './ChainProvider';
import { codec } from '@liskhq/lisk-codec';
import * as cryptography from '@liskhq/lisk-cryptography';
import { transactionSchema } from '../schema/transactionSchema';
import { getTokenBalances } from '../service/token';
import { tryToast } from '../utils/Toast/tryToast';
import { getFactoryTokenMeta } from '../service/factory';
import { getDEXTokenCompact } from '../service/dex';

const WalletConnectContext = React.createContext();

export function useWalletConnect() {
	return useContext(WalletConnectContext);
}

export function WalletConnectProvider({ children }) {
	const [signClient, setSignClient] = React.useState();
	const [wcUri, setWcUri] = React.useState();
	const [sessions, setSessions] = React.useState();
	const [balances, setBalances] = React.useState();
	const [senderPublicKey, setSenderPublicKey] = React.useState();
	const { chain, selectedService } = useChain();

	const createClient = React.useCallback(
		async callback => {
			try {
				const client = await SignClient.init({
					projectId: process.env.REACT_APP_WC_PROJECT_ID,
					metadata: {
						name: process.env.REACT_APP_WC_PROJECT_NAME,
						url: process.env.REACT_APP_WC_PROJECT_URL,
						icons: [process.env.REACT_APP_WC_PROJECT_ICON],
					},
				});

				const session = client.session
					.getAll()
					.find(
						t =>
							Object.keys(t.namespaces).includes('lisk') &&
							t.namespaces.lisk.chains.includes(
								`lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`,
							),
					);
				if (session) {
					setSessions(session);
					setSenderPublicKey(session.namespaces.lisk.accounts[0].slice(14));
				}

				setSignClient(client);
				callback && callback.onSuccess && callback.onSuccess();
			} catch (e) {
				callback && callback.onFailed && callback.onFailed();
			}
		},
		[chain],
	);

	const connect = React.useCallback(
		async callback => {
			if (!signClient) throw Error('Cannot connect. Sign Client is not created');

			try {
				const requiredNamespaces = {
					lisk: {
						chains: [`lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`],
						methods: ['sign_transaction', 'sign_message'],
						events: [
							'session_proposal',
							'session_request',
							'session_ping',
							'session_event',
							'session_update',
							'session_delete',
						],
					},
				};

				const { uri, approval } = await signClient.connect({
					requiredNamespaces,
				});

				setWcUri(uri);

				if (uri) {
					const sessionNamespace = await approval();
					setSessions(sessionNamespace);
					setSenderPublicKey(sessionNamespace.namespaces.lisk.accounts[0].slice(14));
					callback && callback.onSuccess && callback.onSuccess();
				}
			} catch (e) {
				callback && callback.onFailed && callback.onFailed();
			} finally {
				setWcUri(undefined);
			}
		},
		[chain, signClient],
	);

	const disconnect = React.useCallback(
		async callback => {
			try {
				await signClient.disconnect({
					topic: sessions.topic,
					code: 6000,
					message: 'User disconnected',
				});
				setSessions(undefined);
				setSenderPublicKey(undefined);
				setBalances(undefined);
				callback && callback.onSuccess && callback.onSuccess();
			} catch (e) {
				callback && callback.onFailed && callback.onFailed();
			}
		},
		[sessions, signClient],
	);

	const sign = React.useCallback(
		async (transaction, callback) => {
			try {
				const payload = codec
					.encode(transactionSchema, {
						...transaction,
						senderPublicKey: Buffer.from(senderPublicKey, 'hex'),
						signatures: [],
					})
					.toString('hex');

				const schema = {}; // TODO: get schema from service

				const result = await signClient.request({
					topic: sessions.topic,
					request: {
						method: 'sign_transaction',
						params: {
							payload,
							schema,
							recipientChainID: `${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`,
						},
					},
					chainId: `lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`,
				});

				callback && callback.onSuccess && callback.onSuccess();

				return result;
			} catch (e) {
				callback && callback.onFailed && callback.onFailed();
				return undefined;
			}
		},
		[senderPublicKey, chain, sessions, signClient],
	);

	const context = React.useMemo(
		() => ({
			signClient,
			setSignClient,
			sessions,
			setSessions,
			senderPublicKey,
			setSenderPublicKey,
			connect,
			disconnect,
			sign,
			wcUri,
			balances,
		}),
		[signClient, sessions, senderPublicKey, connect, disconnect, sign, wcUri, balances],
	);

	React.useEffect(() => {
		if (signClient) {
			const session = signClient.session
				.getAll()
				.find(
					t =>
						Object.keys(t.namespaces).includes('lisk') &&
						t.namespaces.lisk.chains.includes(`lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`),
				);
			if (session) {
				setSessions(session);
				setSenderPublicKey(session.namespaces.lisk.accounts[0].slice(14));
			} else {
				setSessions(undefined);
				setSenderPublicKey(undefined);
				setBalances(undefined);
			}
		}
		if (wcUri) setWcUri(undefined);
	}, [chain, signClient, wcUri]);

	React.useEffect(() => {
		if (!signClient) createClient();
	}, [createClient, signClient]);

	React.useEffect(() => {
		const run = async () => {
			if (senderPublicKey && selectedService) {
				let balance = [];

				// eslint-disable-next-line no-constant-condition
				while (true) {
					const address = cryptography.address.getLisk32AddressFromPublicKey(
						Buffer.from(senderPublicKey, 'hex'),
					);
					const tokens = await getTokenBalances(
						{ address, limit: process.env.REACT_APP_DEFAULT_REQUEST_LIMIT, offset: balance.length },
						selectedService.serviceURLs,
					);
					if (tokens && tokens.data && tokens.meta) {
						if (tokens.data.length > 0) {
							const tokenMeta = await getFactoryTokenMeta({
								registry: true,
								tokenIds: tokens.data.map(t => t.tokenID).join(','),
							});

							for (let i = 0; i < tokens.data.length; i++) {
								const meta = tokenMeta.data.find(t => t.tokenID === tokens.data[i].tokenID);

								let symbol = meta ? meta.symbol : '???';
								let logo = meta ? meta.logo.png : undefined;
								let tokenName = meta ? meta.tokenName : undefined;
								let decimal = meta
									? meta.denomUnits.find(t => t.denom === symbol.toLowerCase()).decimals
									: undefined;

								if (!meta) {
									const dexMeta = await getDEXTokenCompact({
										search: tokens.data[i].tokenID,
									});
									symbol = dexMeta ? dexMeta.data[0].symbol : '???';
									logo = dexMeta ? dexMeta.data[0].logo : '';
									tokenName = dexMeta ? dexMeta.data[0].tokenName : undefined;
									decimal = dexMeta
										? dexMeta.data[0].decimal
										: process.env.REACT_APP_DEFAULT_TOKEN_DECIMAL;
								}

								const accountBalance = {
									tokenId: tokens.data[i].tokenID,
									balance: tokens.data[i].availableBalance,
									tokenName,
									symbol,
									logo,
									decimal,
								};

								balance.push(accountBalance);
							}
						}
						if (balance.length < tokens.meta.total) {
							continue;
						}
						break;
					}
					break;
				}
				setBalances(balance);
			}
		};

		tryToast('Balance update failed', run);
	}, [selectedService, senderPublicKey]);

	return <WalletConnectContext.Provider value={context}>{children}</WalletConnectContext.Provider>;
}