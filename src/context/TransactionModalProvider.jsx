import React, { useState } from 'react';
import TransactionModal from '../components/Transaction/TransactionModal';
import DecryptKeyModal from '../components/Transaction/DecryptKeyModal';

const TransactionModalContext = React.createContext();

export function useTransactionModal() {
	return React.useContext(TransactionModalContext);
}

export default function TransactionModalProvider({ children }) {
	const [show, setShow] = useState(false);
	const [mode, setMode] = useState('transaction');

	const [onClose, setOnClose] = useState();
	const [onSuccess, setOnSuccess] = useState();
	const [onFailed, setOnFailed] = useState();
	const [customHandler, setCustomHandler] = useState();
	const [transaction, setTransaction] = useState();

	const onDismount = React.useCallback(() => {
		setOnClose();
		setOnSuccess();
		setOnFailed();
		setCustomHandler();
		setMode('transaction');
	}, []);

	const showDecryptModal = React.useCallback(
		async ({ transaction, onClose, onSuccess, onFailed, customHandler }) => {
			setTransaction(transaction);

			setOnClose(() => () => {
				onClose && onClose();
				setShow(false);
				onDismount();
			});

			setOnSuccess(() => () => {
				onSuccess && onSuccess();
			});

			setOnFailed(() => err => {
				onFailed && onFailed(err);
			});

			setCustomHandler(
				customHandler
					? () => async payload => {
							customHandler && (await customHandler(payload));
						}
					: undefined,
			);

			setMode('decrypt');
			setShow(true);
		},
		[onDismount],
	);

	const sendTransaction = React.useCallback(
		async ({ transaction, onClose, onSuccess, onFailed, customHandler }) => {
			setTransaction(transaction);

			setOnClose(() => () => {
				onClose && onClose();
				setShow(false);
				onDismount();
			});

			setOnSuccess(() => () => {
				onSuccess && onSuccess();
			});

			setOnFailed(() => err => {
				onFailed && onFailed(err);
			});

			setCustomHandler(
				customHandler
					? () => async payload => {
							customHandler && (await customHandler(payload));
						}
					: undefined,
			);

			setShow(true);
		},
		[onDismount],
	);

	return (
		<TransactionModalContext.Provider
			value={{
				sendTransaction,
				showDecryptModal,
			}}
		>
			{show ? (
				mode === 'transaction' ? (
					<TransactionModal
						show={show}
						transaction={transaction}
						onClose={onClose}
						onSuccess={onSuccess}
						onFailed={onFailed}
						customSendHandler={customHandler}
					/>
				) : mode === 'decrypt' ? (
					<DecryptKeyModal
						show={show}
						transaction={transaction}
						onClose={onClose}
						onSuccess={onSuccess}
						onFailed={onFailed}
						customSendHandler={customHandler}
					/>
				) : null
			) : null}
			{children}
		</TransactionModalContext.Provider>
	);
}
