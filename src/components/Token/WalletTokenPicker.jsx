import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';
import useTokenColor from '../../utils/hook/useTokenColor';

export default function WalletTokenPicker({
	value,
	blocked,
	onClose,
	onSelect,
	style,
	theme,
	onColor,
	disableSelect,
}) {
	const { pickWalletToken } = useTokenPicker();

	const onColorSelected = React.useCallback(color => onColor && onColor(color), [onColor]);
	useTokenColor(value, onColorSelected);

	return (
		<TokenPickerBase
			disableSelect={disableSelect}
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
