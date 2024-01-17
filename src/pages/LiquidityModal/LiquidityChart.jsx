import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './BarChart.css';
import { useTheme } from '../../context/ThemeProvider';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../../utils/config/env';
import Decimal from 'decimal.js';
import { encodePriceSqrt } from '../../utils/math/priceFormatter';
import { getTickAtSqrtRatio } from '../../utils/tick/tick_math';

const LiquidityChart = ({ data, currentPrice, token0, token1, lowPrice, highPrice, inverted }) => {
	const [theme] = useTheme();

	const [filteredData, setFilteredData] = React.useState([]);
	const [options, setOptions] = React.useState({});
	const [key, setKey] = React.useState();

	React.useEffect(() => {
		if (data && currentPrice && data.length > 0) {
			const currentIndex = data.findIndex(t => Number(t.price) > Number(currentPrice));
			setFilteredData(data.slice(currentIndex - 50, currentIndex + 50).map(t => t.liquidity));
		}
	}, [currentPrice, data]);

	const updateChart = useDebouncedCallback(() => {
		try {
			const annotations = [];

			if (currentPrice) {
				const price = inverted ? new Decimal(currentPrice).pow(-1).toFixed(5) : currentPrice;
				annotations.push({
					x: getTickAtSqrtRatio(encodePriceSqrt(price, 1)),
					borderColor: theme === 'dark' ? '#fff' : '#000',
					label: {
						style: {
							color: '#000',
						},
						text: `Current Price (${price})`,
					},
				});
			}

			if (lowPrice) {
				annotations.push({
					x: getTickAtSqrtRatio(encodePriceSqrt(lowPrice, 1)),
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
				annotations.push({
					x: getTickAtSqrtRatio(encodePriceSqrt(highPrice, 1)),
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
						enabled: true,
					},
				},
				dataLabels: {
					enabled: false,
				},
				toolbar: {
					show: true,
				},
				zoom: {
					enabled: true,
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
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		updateChart();
	}, [highPrice, lowPrice, theme, token0, token1, updateChart]);

	React.useEffect(() => {
		setKey(Math.random());
	}, [data, currentPrice, token0, token1, lowPrice, highPrice]);

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
