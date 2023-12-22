import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeProvider';

export const PriceChart = ({ data }) => {
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
		});
		chart.timeScale().fitContent();

		const newSeries = chart.addBaselineSeries({
			baseValue: { type: 'price', price: data && data[0] && data[0].value ? data[0].value : 0 },
			topLineColor: 'rgba( 38, 166, 154, 1)',
			topFillColor1: 'rgba( 38, 166, 154, 0.28)',
			topFillColor2: 'rgba( 38, 166, 154, 0.05)',
			bottomLineColor: 'rgba( 239, 83, 80, 1)',
			bottomFillColor1: 'rgba( 239, 83, 80, 0.05)',
			bottomFillColor2: 'rgba( 239, 83, 80, 0.28)',
		});
		newSeries.setData(data);

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);

			chart.remove();
		};
	}, [data, theme]);

	return <div ref={chartContainerRef} />;
};
