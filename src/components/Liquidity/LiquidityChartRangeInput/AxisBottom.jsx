import { axisBottom, select } from 'd3';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const StyledGroup = styled.g`
	line {
		display: none;
	}

	text {
		color: var(--color-white);
		transform: translateY(5px);
	}
`;

const Axis = ({ axisGenerator }) => {
	const axisRef = axis => {
		axis &&
			select(axis)
				.call(axisGenerator)
				.call(g => g.select('.domain').remove());
	};

	return <g ref={axisRef} />;
};

export const AxisBottom = ({ xScale, innerHeight, offset = 0 }) =>
	useMemo(
		() => (
			<StyledGroup transform={`translate(0, ${innerHeight + offset})`}>
				<Axis axisGenerator={axisBottom(xScale).ticks(6)} />
			</StyledGroup>
		),
		[innerHeight, offset, xScale],
	);
