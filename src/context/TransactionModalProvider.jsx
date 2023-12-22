import React, { useState } from 'react';
import TransactionModal from '../components/Transaction/TransactionModal';

const TransactionModalContext = React.createContext();

export function useTransactionModal() {
	return React.useContext(TransactionModalContext);
}

export default function TransactionModalProvider({ children }) {
	const [show, setShow] = useState(false);
	const [onClose, setOnClose] = useState();

	const onDismount = React.useCallback(() => {
		setOnClose();
	}, []);

	const sendTransaction = React.useCallback(
		async ({ onClose }) => {
			setOnClose(() => () => {
				onClose && onClose();
				setShow(false);
				onDismount();
			});

			setShow(true);
		},
		[onDismount],
	);

	return (
		<TransactionModalContext.Provider
			value={{
				sendTransaction,
			}}
		>
			{show ? <TransactionModal show={show} onClose={onClose} /> : null}
			{children}
		</TransactionModalContext.Provider>
	);
}
