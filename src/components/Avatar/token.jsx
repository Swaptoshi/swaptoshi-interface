import React from 'react';
import { tokenToColorHex } from '../../utils/Color/tokenToColor';

export default function TokenAvatar({ size, style, src, tokenId, ...props }) {
	const [loaded, setIsLoaded] = React.useState(false);
	const [error, setError] = React.useState(false);

	const onLoad = React.useCallback(() => {
		setIsLoaded(true);
	}, []);

	const onError = React.useCallback(() => {
		setError(true);
	}, []);

	return (
		<div
			style={{
				borderRadius: size,
				height: size,
				width: size,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				...style,
			}}
			{...props}
		>
			{!error && (
				<img
					alt={'logo'}
					src={src}
					style={{
						height: '100%',
						width: '100%',
						display: loaded ? undefined : 'none',
					}}
					onLoad={onLoad}
					onError={onError}
				/>
			)}
			{!loaded && (
				<div
					style={{
						backgroundColor: `#${tokenToColorHex(tokenId)}`,
						height: '100%',
						width: '100%',
					}}
				/>
			)}
		</div>
	);
}
