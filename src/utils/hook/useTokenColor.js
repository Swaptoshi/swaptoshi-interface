import React from 'react';
import { tokenToColorHex } from '../color/tokenToColor';
import { useChain } from '../../context/ChainProvider';

export default function useTokenColor(token, callback) {
	const { dexConfig } = useChain();
	const [color, setColor] = React.useState();

	React.useEffect(() => {
		const getPallete = async () => {
			try {
				if (token) {
					const tokenColor = await tokenToColorHex(token.tokenId, token.logo, dexConfig);
					setColor(tokenColor);
					callback && callback(tokenColor);
				}
			} catch {
				/* empty */
			}
		};

		getPallete();
	}, [callback, color, token, dexConfig]);

	return color;
}
