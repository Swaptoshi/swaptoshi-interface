import React, { useContext } from 'react';
import * as transactions from '@liskhq/lisk-transactions';
import { Buffer } from 'buffer';
import { SignClient } from '@walletconnect/sign-client';
import { useChain } from './ChainProvider';
import { codec } from '@liskhq/lisk-codec';
import * as cryptography from '@liskhq/lisk-cryptography';
import { transactionSchema } from '../utils/schema/transactionSchema';
import { getTokenBalances } from '../service/token';
import { tryToast } from '../utils/toast/tryToast';
import { getFactoryTokenMeta } from '../service/factory';
import { getDEXTokenCompact } from '../service/dex';
import { getAccountAuth } from '../service/auth';
import { getSchema } from '../service/schemas';
import { transformTransaction } from '../utils/transaction/transformer';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../utils/config/env';
import useLocalStorage from 'use-local-storage';

const WalletConnectContext = React.createContext();

export function useWalletConnect() {
	return useContext(WalletConnectContext);
}

export function WalletConnectProvider({ children }) {
	const { chain, selectedService } = useChain();
	const [encryptedPrivateKey, setEncryptedPrivateKey] = useLocalStorage(`private_key`, {});

	const [signClient, setSignClient] = React.useState();
	const [wcUri, setWcUri] = React.useState();
	const [sessions, setSessions] = React.useState();
	const [balances, setBalances] = React.useState();
	const [auth, setAuth] = React.useState();
	const [senderPublicKey, setSenderPublicKey] = React.useState();
	const [plainPrivateKey, setPlainPrivateKey] = React.useState({});

	const storePrivateKey = React.useCallback(
		privateKey => {
			setPlainPrivateKey(t => {
				const state = t;
				state[chain] = privateKey;
				return state;
			});
		},
		[chain],
	);

	const encryptPrivateKey = React.useCallback(
		async password => {
			await tryToast('Encrypt key failed', async () => {
				if (plainPrivateKey[chain] === undefined) throw new Error('Plain private key is not ready');
				const publicKey = cryptography.ed
					.getPublicKeyFromPrivateKey(Buffer.from(plainPrivateKey[chain], 'hex'))
					.toString('hex');
				const encrypted = await cryptography.encrypt.encryptMessageWithPassword(
					plainPrivateKey[chain],
					password,
				);
				setSenderPublicKey(publicKey);
				setEncryptedPrivateKey(t => {
					const state = { ...t };
					state[chain] = { key: encrypted, publicKey };
					return state;
				});
				setPlainPrivateKey(t => {
					const state = { ...t };
					delete state[chain];
					return state;
				});
			});
		},
		[chain, plainPrivateKey, setEncryptedPrivateKey],
	);

	const reset = React.useCallback(() => {
		setSessions(undefined);
		setSenderPublicKey(undefined);
		setBalances(undefined);

		setPlainPrivateKey(t => {
			const state = { ...t };
			delete state[chain];
			return state;
		});
		setEncryptedPrivateKey(t => {
			const state = { ...t };
			delete state[chain];
			return state;
		});
	}, [chain, setEncryptedPrivateKey]);

	const subscribeToEvents = React.useCallback(
		async client => {
			tryToast('Wallet connect error', async () => {
				if (!client) throw Error('No events to subscribe to b/c the client does not exist');
				client.on('session_delete', () => {
					reset();
				});
			});
		},
		[reset],
	);

	const createClient = React.useCallback(
		async callback => {
			try {
				const client = await SignClient.init({
					projectId: env.WC_PROJECT_ID,
					metadata: {
						name: env.WC_PROJECT_NAME,
						url: env.WC_PROJECT_URL,
						icons: [env.WC_PROJECT_ICON],
					},
				});

				const session = client.session
					.getAll()
					.find(
						t =>
							Object.keys(t.namespaces).includes('lisk') &&
							t.namespaces.lisk.chains.includes(`lisk:${chain}${env.CHAIN_SUFFIX}`),
					);
				if (session) {
					setSessions(session);
					setSenderPublicKey(session.namespaces.lisk.accounts[0].slice(14));
				}

				setSignClient(client);
				subscribeToEvents(client);

				if (encryptedPrivateKey[chain] && encryptedPrivateKey[chain].publicKey) {
					setSenderPublicKey(encryptedPrivateKey[chain].publicKey);
				}
				callback && callback.onSuccess && callback.onSuccess();
			} catch (e) {
				callback && callback.onFailed && callback.onFailed();
			}
		},
		[chain, encryptedPrivateKey, subscribeToEvents],
	);

	const connect = React.useCallback(
		async callback => {
			if (!signClient) throw Error('Cannot connect. Sign Client is not created');

			try {
				const requiredNamespaces = {
					lisk: {
						chains: [`lisk:${chain}${env.CHAIN_SUFFIX}`],
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
				callback && callback.onSuccess && callback.onSuccess();
			} catch (e) {
				callback && callback.onFailed && callback.onFailed();
			} finally {
				reset();
			}
		},
		[sessions, signClient, reset],
	);

	const reloadAuth = React.useCallback(async () => {
		if (senderPublicKey) {
			const authResponse = await getAccountAuth(
				{
					address: cryptography.address.getLisk32AddressFromPublicKey(
						Buffer.from(senderPublicKey, 'hex'),
					),
				},
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (authResponse && authResponse.data) {
				setAuth(authResponse.data);
				return authResponse.data;
			}
		}
	}, [selectedService, senderPublicKey]);

	const sign = React.useCallback(
		async (transaction, password, callback) => {
			try {
				const updatedAuth = await reloadAuth();
				const unsignedTransaction = {
					...(await transformTransaction(transaction)),
					nonce: BigInt(updatedAuth.nonce),
					senderPublicKey: Buffer.from(senderPublicKey, 'hex'),
					signatures: [],
				};
				const payload = codec.encode(transactionSchema, unsignedTransaction).toString('hex');

				const schema = await getSchema(
					transaction,
					selectedService ? selectedService.serviceURLs : undefined,
				);
				if (!schema) throw new Error('schema not found');

				let result;

				if (plainPrivateKey[chain]) {
					result = transactions.signTransaction(
						unsignedTransaction,
						Buffer.from(`${chain}:${env.CHAIN_SUFFIX}`, 'hex'),
						Buffer.from(plainPrivateKey[chain], 'hex'),
						schema,
					);
				} else if (encryptedPrivateKey[chain] && encryptedPrivateKey[chain].key && password) {
					const decryptedPrivateKey = await cryptography.encrypt.decryptMessageWithPassword(
						encryptedPrivateKey[chain].key,
						password,
					);
					result = transactions.signTransaction(
						unsignedTransaction,
						Buffer.from(`${chain}:${env.CHAIN_SUFFIX}`, 'hex'),
						Buffer.from(decryptedPrivateKey, 'hex'),
						schema,
					);
				} else {
					result = await signClient.request({
						topic: sessions.topic,
						request: {
							method: 'sign_transaction',
							params: {
								payload,
								schema,
								recipientChainID: `${chain}${env.CHAIN_SUFFIX}`,
							},
						},
						chainId: `lisk:${chain}${env.CHAIN_SUFFIX}`,
					});
				}

				if (!result) throw new Error('sign failed');

				callback && callback.onSuccess && callback.onSuccess();

				const res = codec
					.encode(transactionSchema, await transformTransaction(JSON.parse(result)))
					.toString('hex');

				return res;
			} catch (e) {
				console.error(e);
				callback && callback.onFailed && callback.onFailed();
				return undefined;
			}
		},
		[
			reloadAuth,
			senderPublicKey,
			selectedService,
			plainPrivateKey,
			encryptedPrivateKey,
			chain,
			signClient,
			sessions,
		],
	);

	const updateBalance = React.useCallback(async () => {
		let balance = [];

		// eslint-disable-next-line no-constant-condition
		while (true) {
			const address = cryptography.address.getLisk32AddressFromPublicKey(
				Buffer.from(senderPublicKey, 'hex'),
			);
			const tokens = await getTokenBalances(
				{ address, limit: env.DEFAULT_REQUEST_LIMIT, offset: balance.length },
				selectedService ? selectedService.serviceURLs : undefined,
			);
			if (tokens && tokens.data && tokens.meta) {
				if (tokens.data.length > 0) {
					const tokenMeta = await getFactoryTokenMeta({
						registry: true,
						tokenIds: tokens.data.map(t => t.tokenID).join(','),
					});

					for (let i = 0; i < tokens.data.length; i++) {
						const meta = tokenMeta.data.find(t => t.tokenID === tokens.data[i].tokenID);

						let symbol = meta && meta.symbol ? meta.symbol : '???';
						let logo = meta ? meta.logo.png : '';
						let tokenName = meta ? meta.tokenName : '';
						let decimal =
							meta && symbol !== '???'
								? meta.denomUnits.find(t => t.denom === symbol.toLowerCase()).decimals
								: env.DEFAULT_TOKEN_DECIMAL;

						if (!meta) {
							const dexMeta = await getDEXTokenCompact({
								search: tokens.data[i].tokenID,
							});
							symbol =
								dexMeta.data.length > 0 && dexMeta.data[0].symbol ? dexMeta.data[0].symbol : '???';
							logo = dexMeta.data.length > 0 ? dexMeta.data[0].logo : '';
							tokenName = dexMeta.data.length > 0 ? dexMeta.data[0].tokenName : '';
							decimal =
								dexMeta.data.length > 0 ? dexMeta.data[0].decimal : env.DEFAULT_TOKEN_DECIMAL;
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
	}, [selectedService, senderPublicKey]);

	const updateAccount = useDebouncedCallback(async () => {
		const run = async () => {
			if (senderPublicKey && selectedService) {
				await updateBalance();
				await reloadAuth();
			}
		};

		tryToast('Balance update failed', run);
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		updateAccount();
	}, [reloadAuth, selectedService, senderPublicKey, updateAccount, updateBalance]);

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
			auth,
			reloadAuth,
			storePrivateKey,
			encryptPrivateKey,
			encryptedPrivateKey,
			plainPrivateKey,
			updateAccount,
		}),
		[
			signClient,
			sessions,
			senderPublicKey,
			connect,
			disconnect,
			sign,
			wcUri,
			balances,
			auth,
			reloadAuth,
			updateAccount,
			storePrivateKey,
			encryptPrivateKey,
			encryptedPrivateKey,
			plainPrivateKey,
		],
	);

	// chain change side-effects
	React.useEffect(() => {
		if (signClient) {
			const session = signClient.session
				.getAll()
				.find(
					t =>
						Object.keys(t.namespaces).includes('lisk') &&
						t.namespaces.lisk.chains.includes(`lisk:${chain}${env.CHAIN_SUFFIX}`),
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chain]);

	React.useEffect(() => {
		if (!signClient) createClient();
	}, [createClient, signClient]);

	return <WalletConnectContext.Provider value={context}>{children}</WalletConnectContext.Provider>;
}
