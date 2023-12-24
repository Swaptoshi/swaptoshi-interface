import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';

export default function TradableTokenPicker({
	value,
	blocked,
	onClose,
	onSelect,
	style,
	theme,
	disableSelect,
}) {
	const { pickTradableToken } = useTokenPicker();

	return (
		<TokenPickerBase
			disableSelect={disableSelect}
			value={value}
			blocked={blocked}
			onClose={onClose}
			onSelect={onSelect}
			picker={pickTradableToken}
			style={style}
			theme={theme}
		/>
	);
}
