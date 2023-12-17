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
	const [onClose, setOnClose] = useState();
	const [onSelect, setOnSelect] = useState();

	const onDismount = React.useCallback(() => {
		setSelected();
		setOnClose();
		setOnSelect();
	}, []);

	const pickTradableToken = React.useCallback(
		async ({ selected, onClose, onSelect }) => {
			setMode('tradable');

			setShow(true);
			setSelected(selected);

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
		},
		[onDismount],
	);

	const pickWalletToken = React.useCallback(
		({ selected, onClose, onSelect }) => {
			setMode('wallet');

			setShow(true);
			setSelected(selected);

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
