import { area, curveStepAfter } from 'd3';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const Path = styled.path`
	opacity: 0.5;
	stroke: ${({ fill }) => fill ?? 'var(--primary)'};
	fill: ${({ fill }) => fill ?? 'var(--primary)'};
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
						.y0(yScale(0))(series) ?? undefined
				}
			/>
		),
		[fill, series, xScale, xValue, yScale, yValue],
	);
