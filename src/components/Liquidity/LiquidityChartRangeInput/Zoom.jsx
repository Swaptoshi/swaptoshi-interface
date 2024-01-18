import { select, zoom, zoomIdentity } from 'd3';
import React, { useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import TertiaryButton from '../../Button/TertiaryButton';

const Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(${({ count }) => count.toString()}, 1fr);
	grid-gap: 6px;

	position: absolute;
	top: -32px;
	right: 0;
`;

const Button = styled(TertiaryButton)`
	width: 32px;
	height: 32px;
	padding: 4px;
`;

export const ZoomOverlay = styled.rect`
	fill: transparent;
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
`;

export default function Zoom({
	svg,
	xScale,
	setZoom,
	width,
	height,
	resetBrush,
	showResetButton,
	zoomLevels,
}) {
	const zoomBehavior = useRef();

	const [zoomIn, zoomOut, zoomInitial, zoomReset] = useMemo(
		() => [
			() =>
				svg &&
				zoomBehavior.current &&
				select(svg).transition().call(zoomBehavior.current.scaleBy, 2),
			() =>
				svg &&
				zoomBehavior.current &&
				select(svg).transition().call(zoomBehavior.current.scaleBy, 0.5),
			() =>
				svg &&
				zoomBehavior.current &&
				select(svg).transition().call(zoomBehavior.current.scaleTo, 0.5),
			() =>
				svg &&
				zoomBehavior.current &&
				select(svg)
					.call(zoomBehavior.current.transform, zoomIdentity.translate(0, 0).scale(1))
					.transition()
					.call(zoomBehavior.current.scaleTo, 0.5),
		],
		[svg],
	);

	useEffect(() => {
		if (!svg) return;

		zoomBehavior.current = zoom()
			.scaleExtent([zoomLevels.min, zoomLevels.max])
			.extent([
				[0, 0],
				[width, height],
			])
			.on('zoom', ({ transform }) => setZoom(transform));

		select(svg).call(zoomBehavior.current);
	}, [
		height,
		width,
		setZoom,
		svg,
		xScale,
		zoomBehavior,
		zoomLevels,
		zoomLevels.max,
		zoomLevels.min,
	]);

	useEffect(() => {
		// reset zoom to initial on zoomLevel change
		zoomInitial();
	}, [zoomInitial, zoomLevels]);

	return (
		<Wrapper count={showResetButton ? 3 : 2}>
			{showResetButton && (
				<Button
					onClick={() => {
						resetBrush();
						zoomReset();
					}}
					disabled={false}
				>
					<i className="ri-refresh-line" style={{ fontSize: '16px' }}></i>
				</Button>
			)}
			<Button onClick={zoomIn} disabled={false}>
				<i className="ri-zoom-in-line" style={{ fontSize: '16px' }}></i>
			</Button>
			<Button onClick={zoomOut} disabled={false}>
				<i className="ri-zoom-out-line" style={{ fontSize: '16px' }}></i>
			</Button>
		</Wrapper>
	);
}
