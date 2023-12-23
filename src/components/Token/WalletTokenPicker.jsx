import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';

export default function WalletTokenPicker({ value, blocked, onClose, onSelect, style, theme }) {
	const { pickWalletToken } = useTokenPicker();

	return (
		<TokenPickerBase
			value={value}
			blocked={blocked}
			onClose={onClose}
			onSelect={onSelect}
			picker={pickWalletToken}
			style={style}
			theme={theme}
		/>
	);
}
