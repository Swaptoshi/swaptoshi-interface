import React, { useState } from 'react';
import TokenPicker from '../components/Token/TokenPickerModal';

const TokenPickerContext = React.createContext();

export function useTokenPicker() {
	return React.useContext(TokenPickerContext);
}

export default function TokenPickerProvider({ children }) {
	const [show, setShow] = useState(false);
	const [mode, setMode] = useState();
	const [selected, setSelected] = useState();
	const [blocked, setBlocked] = useState();
	const [onClose, setOnClose] = useState();
	const [onSelect, setOnSelect] = useState();

	const onDismount = React.useCallback(() => {
		setSelected();
		setOnClose();
		setOnSelect();
	}, []);

	const pickTradableToken = React.useCallback(
		async ({ selected, blocked, onClose, onSelect }) => {
			setMode('tradable');

			setSelected(selected);
			setBlocked(blocked);

			setOnClose(() => () => {
				onClose && onClose();
				setShow(false);
				onDismount();
			});
			setOnSelect(() => item => {
				onSelect(item);
				setShow(false);
				onDismount();
			});

			setShow(true);
		},
		[onDismount],
	);

	const pickWalletToken = React.useCallback(
		({ selected, blocked, onClose, onSelect }) => {
			setMode('wallet');

			setSelected(selected);
			setBlocked(blocked);

			setOnClose(() => () => {
				onClose && onClose();
				setShow(false);
				onDismount();
			});
			setOnSelect(() => item => {
				onSelect(item);
				setShow(false);
				onDismount();
			});

			setShow(true);
		},
		[onDismount],
	);

	return (
		<TokenPickerContext.Provider
			value={{
				pickTradableToken,
				pickWalletToken,
			}}
		>
			{show ? (
				<TokenPicker
					show={show}
					blocked={blocked}
					mode={mode}
					onClose={onClose}
					onSelect={onSelect}
					selected={selected}
				/>
			) : null}
			{children}
		</TokenPickerContext.Provider>
	);
}
