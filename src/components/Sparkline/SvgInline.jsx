import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function SvgInline(props) {
	const [svg, setSvg] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [isErrored, setIsErrored] = useState(false);

	const reset = React.useCallback(() => {
		setSvg(null);
		setIsErrored(false);
		setIsLoaded(false);
	}, []);

	useEffect(() => {
		const run = async () => {
			try {
				reset();
				const svg = await axios.get(props.url);
				setSvg(svg.data);
			} catch {
				setIsErrored(true);
			} finally {
				setIsLoaded(true);
			}
		};
		run();
	}, [props.url, reset]);

	return (
		<div
			className={`svgInline svgInline--${isLoaded ? 'loaded' : 'loading'} ${
				isErrored ? 'svgInline--errored' : ''
			}`}
			style={props.style}
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
}
