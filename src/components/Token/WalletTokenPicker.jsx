import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';

export default function WalletTokenPicker({ value, onClose, onSelect }) {
	const { pickWalletToken } = useTokenPicker();

	return (
		<TokenPickerBase value={value} onClose={onClose} onSelect={onSelect} picker={pickWalletToken} />
	);
}
