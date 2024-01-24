import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeProvider';
import { hexToRgba } from '../../utils/color/hexToRgba';

export const PriceChart = ({ data, type }) => {
	const [theme] = useTheme();
	const chartContainerRef = useRef();

	useEffect(() => {
		const handleResize = () => {
			chart.applyOptions({ width: chartContainerRef.current.clientWidth });
		};

		const chart = createChart(chartContainerRef.current, {
			layout: {
				background: { type: ColorType.Solid, color: 'transparent' },
				textColor: theme === 'light' ? 'black' : 'white',
			},
			width: chartContainerRef.current.clientWidth,
			height: 350,
			handleScroll: false,
			handleScale: false,
			grid: { horzLines: { visible: false }, vertLines: { visible: false } },
			localization: {
				priceFormatter: p => `${p.toFixed(4)}`,
			},
		});
		chart.timeScale().fitContent();

		const green = getComputedStyle(document.documentElement).getPropertyValue('--green');
		const red = getComputedStyle(document.documentElement).getPropertyValue('--red');

		let newSeries;

		if (type === 'tick') {
			newSeries = chart.addBaselineSeries({
				baseValue: { type: 'price', price: data && data[0] && data[0].value ? data[0].value : 0 },
				topLineColor: hexToRgba(green, 1),
				topFillColor1: hexToRgba(green, 0.28),
				topFillColor2: hexToRgba(green, 0.05),
				bottomLineColor: hexToRgba(red, 1),
				bottomFillColor1: hexToRgba(red, 0.05),
				bottomFillColor2: hexToRgba(red, 0.28),
			});
		} else if (type === 'ohlc') {
			newSeries = chart.addCandlestickSeries({
				upColor: green,
				downColor: red,
				borderVisible: false,
				wickUpColor: green,
				wickDownColor: red,
			});
		}

		newSeries.setData(data);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);

			chart.remove();
		};
	}, [data, theme, type]);

	return <div ref={chartContainerRef} />;
};
