import { area, curveStepAfter } from 'd3';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const Path = styled.path`
	opacity: 0.5;
	stroke: ${({ fill }) => fill ?? 'var(--btn-color)'};
	fill: ${({ fill }) => fill ?? 'var(--btn-color)'};
`;

export const Area = ({ series, xScale, yScale, xValue, yValue, fill }) =>
	useMemo(
		() => (
			<Path
				fill={fill}
				d={
					area()
						.curve(curveStepAfter)
						.x(d => xScale(xValue(d)))
						.y1(d => yScale(yValue(d)))
						.y0(yScale(0))(
						series.filter(d => {
							const value = xScale(xValue(d));
							return value > 0 && value <= window.innerWidth;
						}),
					) ?? undefined
				}
			/>
		),
		[fill, series, xScale, xValue, yScale, yValue],
	);
