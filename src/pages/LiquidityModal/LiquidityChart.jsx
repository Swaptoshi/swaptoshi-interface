import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './BarChart.css';
import { useTheme } from '../../context/ThemeProvider';
import { decodeTickPrice, encodePriceSqrt } from '../../utils/math/priceFormatter';
import { getTickAtSqrtRatio } from '../../utils/tick/tick_math';
import { useDebouncedCallback } from 'use-debounce';

const LiquidityChart = ({ data, currentTick, token0, token1, lowPrice, highPrice }) => {
	const [theme] = useTheme();

	const [filteredData, setFilteredData] = React.useState([]);
	const [options, setOptions] = React.useState({});
	const [inverted, setInverted] = React.useState();
	const [key, setKey] = React.useState();

	React.useEffect(() => {
		if (token0 && token1) {
			setInverted(token0.tokenId >= token1.tokenId);
		}
	}, [token0, token1]);

	React.useEffect(() => {
		if (data && currentTick && data.length > 0) {
			const desiredLength = 100;
			const spacing = 300;

			const currentIndex = data.findIndex(t => t[0] === currentTick);
			const slicedWithSpace = [];

			// TODO: check here
			if (inverted) {
				for (
					let i = currentIndex + desiredLength * spacing;
					i >= currentIndex - desiredLength * spacing;
					i -= spacing
				) {
					if (data[i] !== undefined) slicedWithSpace.push(data[i]);
				}
			} else {
				for (
					let i = currentIndex - desiredLength * spacing;
					i < currentIndex + desiredLength * spacing;
					i += spacing
				) {
					if (data[i] !== undefined) slicedWithSpace.push(data[i]);
				}
			}

			setFilteredData(slicedWithSpace);
		}
	}, [currentTick, data, inverted]);

	const updateChart = useDebouncedCallback(
		() => {
			try {
				const annotations = [];

				if (currentTick) {
					const currentPrice = decodeTickPrice(
						currentTick,
						token0.decimal,
						token1.decimal,
						inverted,
					);
					const sqrtPirce = encodePriceSqrt(
						inverted ? 1 : currentPrice,
						inverted ? currentPrice : 1,
					);
					annotations.push({
						x: getTickAtSqrtRatio(sqrtPirce),
						borderColor: theme === 'dark' ? '#fff' : '#000',
						label: {
							style: {
								color: '#000',
							},
							text: `Current Price (${currentPrice})`,
						},
					});
				}

				if (lowPrice) {
					const sqrtPirce = encodePriceSqrt(inverted ? 1 : lowPrice, inverted ? lowPrice : 1);
					annotations.push({
						x: getTickAtSqrtRatio(sqrtPirce),
						borderColor: theme === 'dark' ? '#fff' : '#000',
						label: {
							style: {
								color: '#000',
							},
							text: `Low Price (${lowPrice})`,
						},
					});
				}

				if (highPrice) {
					const sqrtPirce = encodePriceSqrt(inverted ? 1 : highPrice, inverted ? highPrice : 1);
					annotations.push({
						x: getTickAtSqrtRatio(sqrtPirce),
						borderColor: theme === 'dark' ? '#fff' : '#000',
						label: {
							style: {
								color: '#000',
							},
							text: `High Price (${highPrice})`,
						},
					});
				}

				const op = {
					chart: {
						zoom: {
							enabled: false,
						},
					},
					dataLabels: {
						enabled: false,
					},
					toolbar: {
						show: false,
					},
					zoom: {
						enabled: false,
					},
					xaxis: {
						labels: {
							show: false,
						},
					},
					yaxis: {
						show: false,
					},
					grid: {
						show: false,
					},
					annotations: {
						xaxis: annotations,
					},
				};

				setOptions(op);
			} catch (err) {
				/* empty */
			}
		},
		Number(process.env.REACT_APP_EFFECT_DEBOUNCE_WAIT ?? 500),
	);

	React.useEffect(() => {
		updateChart();
	}, [highPrice, lowPrice, theme, token0, token1, updateChart]);

	React.useEffect(() => {
		setKey(Math.random());
	}, [data, currentTick, token0, token1, lowPrice, highPrice]);

	console.log(filteredData);

	return filteredData.length > 0 ? (
		<React.Fragment key={key}>
			<div>
				<ReactApexChart
					options={options}
					series={[{ name: 'Liquidity', data: filteredData }]}
					type="area"
					height={350}
				/>
			</div>
		</React.Fragment>
	) : null;
};

export default LiquidityChart;
