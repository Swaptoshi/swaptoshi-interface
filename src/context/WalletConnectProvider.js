import React, { useContext } from "react";
import { SignClient } from "@walletconnect/sign-client";
import { useChain } from "./ChainProvider";
import { codec } from "@liskhq/lisk-codec";
import { transactionSchema } from "../schema/transactionSchema";

const WalletConnectContext = React.createContext();

export function useWalletConnect() {
  return useContext(WalletConnectContext);
}

export function WalletConnectProvider({ children }) {
  const [signClient, setSignClient] = React.useState();
  const [wcUri, setWcUri] = React.useState();
  const [sessions, setSessions] = React.useState();
  const [senderPublicKey, setSenderPublicKey] = React.useState();
  const { chain } = useChain();

  const createClient = React.useCallback(
    async (callback) => {
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
            (t) =>
              Object.keys(t.namespaces).includes("lisk") &&
              t.namespaces.lisk.chains.includes(
                `lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`
              )
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
    [chain]
  );

  const connect = React.useCallback(
    async (callback) => {
      if (!signClient)
        throw Error("Cannot connect. Sign Client is not created");

      try {
        const requiredNamespaces = {
          lisk: {
            chains: [`lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`],
            methods: ["sign_transaction", "sign_message"],
            events: [
              "session_proposal",
              "session_request",
              "session_ping",
              "session_event",
              "session_update",
              "session_delete",
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
          setSenderPublicKey(
            sessionNamespace.namespaces.lisk.accounts[0].slice(14)
          );
          callback && callback.onSuccess && callback.onSuccess();
        }
      } catch (e) {
        callback && callback.onFailed && callback.onFailed();
      } finally {
        setWcUri(undefined);
      }
    },
    [chain, signClient]
  );

  const disconnect = React.useCallback(
    async (callback) => {
      try {
        await signClient.disconnect({
          topic: sessions.topic,
          code: 6000,
          message: "User disconnected",
        });
        setSessions(undefined);
        setSenderPublicKey(undefined);
        callback && callback.onSuccess && callback.onSuccess();
      } catch (e) {
        callback && callback.onFailed && callback.onFailed();
      }
    },
    [sessions, signClient]
  );

  const sign = React.useCallback(
    async (transaction, callback) => {
      try {
        const payload = codec
          .encode(transactionSchema, {
            ...transaction,
            senderPublicKey: Buffer.from(senderPublicKey, "hex"),
            signatures: [],
          })
          .toString("hex");

        const schema = {}; // TODO: get schema from service

        const result = await signClient.request({
          topic: sessions.topic,
          request: {
            method: "sign_transaction",
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
    [senderPublicKey, chain, sessions, signClient]
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
    }),
    [signClient, sessions, senderPublicKey, connect, disconnect, sign, wcUri]
  );

  React.useEffect(() => {
    if (signClient) {
      const session = signClient.session
        .getAll()
        .find(
          (t) =>
            Object.keys(t.namespaces).includes("lisk") &&
            t.namespaces.lisk.chains.includes(
              `lisk:${chain}${process.env.REACT_APP_CHAIN_SUFFIX}`
            )
        );
      if (session) {
        setSessions(session);
        setSenderPublicKey(session.namespaces.lisk.accounts[0].slice(14));
      } else {
        setSessions(undefined);
        setSenderPublicKey(undefined);
      }
    }
    if (wcUri) setWcUri(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain]);

  React.useEffect(() => {
    if (!signClient) createClient();
  }, [createClient, signClient]);

  return (
    <WalletConnectContext.Provider value={context}>
      {children}
    </WalletConnectContext.Provider>
  );
}
