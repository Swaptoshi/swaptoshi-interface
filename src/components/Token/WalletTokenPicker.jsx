import React from 'react';
import { useTokenPicker } from '../../context/TokenPickerProvider';
import TokenPickerBase from './TokenPickerBase';
import { tokenToColorHex } from '../../utils/color/tokenToColor';

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

	React.useEffect(() => {
		const getPallete = async () => {
			try {
				if (onColor && value) {
					const color = await tokenToColorHex(value.tokenId, value.logo);
					onColor(color);
				}
			} catch {
				/* empty */
			}
		};

		getPallete();
	}, [onColor, value]);

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
