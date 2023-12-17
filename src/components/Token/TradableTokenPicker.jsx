import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';

export default function TradalbeTokenPicker({ value, onClose, onSelect }) {
	const { pickTradableToken } = useTokenPicker();

	return (
		<TokenPickerBase
			value={value}
			onClose={onClose}
			onSelect={onSelect}
			picker={pickTradableToken}
		/>
	);
}
