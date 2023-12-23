import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';

export default function TradableTokenPicker({ value, blocked, onClose, onSelect, style, theme }) {
	const { pickTradableToken } = useTokenPicker();

	return (
		<TokenPickerBase
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
