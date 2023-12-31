import React from 'react';
import { tokenToColorHex } from '../../utils/color/tokenToColor';

export default function TokenAvatar({ size, style, src, tokenId, ...props }) {
	const [loaded, setIsLoaded] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [key, setKey] = React.useState(0);

	const onLoad = React.useCallback(() => {
		setIsLoaded(true);
		setError(false);
	}, []);

	const onError = React.useCallback(() => {
		setError(true);
	}, []);

	React.useEffect(() => {
		setKey(Math.random());
	}, [src, tokenId]);

	return (
		<div
			style={{
				borderRadius: size,
				height: size,
				width: size,
				minHeight: size,
				minWidth: size,
				overflow: 'hidden',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				...style,
			}}
			{...props}
		>
			<img
				key={key}
				alt={'logo'}
				src={src}
				style={{
					height: '100%',
					width: '100%',
					display: error ? 'none' : loaded ? undefined : 'none',
				}}
				onLoad={onLoad}
				onError={onError}
			/>
			{error && (
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
