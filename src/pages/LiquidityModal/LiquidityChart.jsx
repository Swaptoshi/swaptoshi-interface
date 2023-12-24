import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './BarChart.css';
import { useTheme } from '../../context/ThemeProvider';
import { decodeTickPrice, encodePriceSqrt } from '../../utils/Math/priceFormatter';
import { getTickAtSqrtRatio } from '../../utils/Tick/tick_math';
import { useDebouncedCallback } from 'use-debounce';

const LiquidityChart = ({ data, currentTick, token0, token1, lowPrice, highPrice }) => {
	const [theme] = useTheme();

	const [filteredData, setFilteredData] = React.useState([]);
	const [options, setOptions] = React.useState({});

	React.useEffect(() => {
		if (data && currentTick && data.length > 0) {
			const desiredLength = 100;
			const spacing = 300;

			const currentIndex = data.findIndex(t => t[0] === currentTick);
			const slicedWithSpace = [];
			for (
				let i = currentIndex - desiredLength * spacing;
				i < currentIndex + desiredLength * spacing;
				i += spacing
			) {
				slicedWithSpace.push(data[i]);
			}

			setFilteredData(slicedWithSpace);
			decodeTickPrice;
		}
	}, [currentTick, data]);

	const updateChart = useDebouncedCallback(() => {
		try {
			const annotations = [];

			if (currentTick) {
				const currentPrice = decodeTickPrice(currentTick, token0.decimal, token1.decimal);
				annotations.push({
					x: currentTick,
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
				const sqrtPirce = encodePriceSqrt(lowPrice, 1);
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
				const sqrtPirce = encodePriceSqrt(highPrice, 1);
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
	}, 500);

	React.useEffect(() => {
		updateChart();
	}, [highPrice, lowPrice, theme, token0, token1, updateChart]);

	return data.length > 0 ? (
		<React.Fragment>
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
