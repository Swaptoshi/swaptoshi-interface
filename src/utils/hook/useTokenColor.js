import React from 'react';
import { tokenToColorHex } from '../color/tokenToColor';

export default function useTokenColor(token, callback) {
	const [color, setColor] = React.useState();

	React.useEffect(() => {
		const getPallete = async () => {
			try {
				if (token) {
					const tokenColor = await tokenToColorHex(token.tokenId, token.logo);
					setColor(tokenColor);
					callback && callback(tokenColor);
				}
			} catch {
				/* empty */
			}
		};

		getPallete();
	}, [callback, color, token]);

	return color;
}
