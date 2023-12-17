import React, { useState } from 'react';
import TokenPicker from '../components/Token/TokenPickerModal';
import { swapTokens } from '../service/swapTokens';

const TokenPickerContext = React.createContext();

export function useTokenPicker() {
	return React.useContext(TokenPickerContext);
}

export default function TokenPickerProvider({ children }) {
	const [show, setShow] = useState();
	const [data, setData] = useState();
	const [selected, setSelected] = useState();
	const [onClose, setOnClose] = useState();
	const [onSelect, setOnSelect] = useState();

	const onDismount = React.useCallback(() => {
		setData();
		setSelected();
		setOnClose();
		setOnSelect();
	}, []);

	const pickTradableToken = React.useCallback(({ selected, onClose, onSelect }) => {
		setSelected(selected);

		setOnClose(() => () => {
			onClose();
			setShow(false);
			onDismount();
		});
		setOnSelect(() => item => {
			onSelect(item);
			setShow(false);
			onDismount();
		});

		// fetch data and setData
		setData(swapTokens);
		setShow(true);
	}, []);

	const pickWalletToken = React.useCallback(({ selected, onClose, onSelect }) => {
		setSelected(selected);

		setOnClose(() => () => {
			onClose();
			setShow(false);
			onDismount();
		});
		setOnSelect(() => item => {
			onSelect(item);
			setShow(false);
			onDismount();
		});

		// fetch data and setData
		setData(swapTokens);
		setShow(true);
	}, []);

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
					data={data}
					onClose={onClose}
					onSelect={onSelect}
					selected={selected}
				/>
			) : null}
			{children}
		</TokenPickerContext.Provider>
	);
}
