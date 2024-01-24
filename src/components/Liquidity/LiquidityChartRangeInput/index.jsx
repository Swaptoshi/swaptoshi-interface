import React, { useCallback, useMemo } from 'react';
import { Chart } from './Chart';
import Loader from '../../Loader';
import InfoBox from '../../Message/InfoBox';
import { INFINITE } from '../../../utils/constants/tick';
import { decodeTickPrice } from '../../../utils/math/priceFormatter';
import { getMaxTick } from '../../../utils/tick/price_tick';
import useTokenColor from '../../../utils/hook/useTokenColor';

const ZOOM_LEVELS = {
	['100']: {
		initialMin: 0.999,
		initialMax: 1.001,
		min: 0.00001,
		max: 1.5,
	},
	['500']: {
		initialMin: 0.999,
		initialMax: 1.001,
		min: 0.00001,
		max: 1.5,
	},
	['3000']: {
		initialMin: 0.5,
		initialMax: 2,
		min: 0.00001,
		max: 20,
	},
	['10000']: {
		initialMin: 0.5,
		initialMax: 2,
		min: 0.00001,
		max: 20,
	},
};

export default function LiquidityChartRangeInput({
	currencyA,
	currencyB,
	feeAmount,
	tickSpacing,
	ticks,
	ticksAtLimit,
	price,
	priceLower,
	priceUpper,
	onLeftRangeInput,
	onRightRangeInput,
	interactive,
	isLoading,
	error,
}) {
	const tokenAColor = useTokenColor(currencyA);
	const tokenBColor = useTokenColor(currencyB);

	const onBrushDomainChangeEnded = useCallback(
		(domain, mode) => {
			let leftRangeValue = Number(domain[0]);
			const rightRangeValue = Number(domain[1]);

			if (leftRangeValue <= 0) {
				leftRangeValue = 1 / 10 ** 5;
			}

			if ((!ticksAtLimit['LOWER'] || mode === 'handle' || mode === 'reset') && leftRangeValue > 0) {
				onLeftRangeInput(leftRangeValue.toFixed(5));
			}

			if ((!ticksAtLimit['UPPER'] || mode === 'reset') && rightRangeValue > 0) {
				// todo: remove this check. Upper bound for large numbers
				// sometimes fails to parse to tick.
				if (rightRangeValue < 1e35) {
					onRightRangeInput(rightRangeValue.toFixed(5));
				}
			}
		},
		[onLeftRangeInput, onRightRangeInput, ticksAtLimit],
	);

	interactive = interactive && Boolean(ticks?.length);

	const brushDomain = useMemo(() => {
		const leftPrice = priceLower;
		const rightPrice =
			priceUpper === INFINITE ? decodeTickPrice(getMaxTick(tickSpacing)) : priceUpper;

		return leftPrice && rightPrice ? [parseFloat(leftPrice), parseFloat(rightPrice)] : undefined;
	}, [priceLower, priceUpper, tickSpacing]);

	const brushLabelValue = useCallback(
		(d, x) => {
			if (!price) return '';

			if (d === 'w' && ticksAtLimit['LOWER']) return '0';
			if (d === 'e' && ticksAtLimit['UPPER']) return '∞';

			const percent =
				(x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100;

			return price ? `${(Math.sign(percent) < 0 ? '-' : '') + Math.abs(percent).toFixed(2)}%` : '';
		},
		[price, ticksAtLimit],
	);

	const isUninitialized = !currencyA || !currencyB || (ticks === undefined && !isLoading);

	return (
		<div
			style={{
				minHeight: '200px',
				display: 'grid',
				gridAutoRows: 'auto',
				gridRowGap: 'md',
			}}
		>
			{isUninitialized ? (
				<InfoBox message={'Your position will appear here.'} icon={'ri-inbox-2-line'} />
			) : isLoading ? (
				<Loader size={40} />
			) : error && !ticks ? (
				<InfoBox message={'Liquidity data not available.'} icon={'ri-cloud-off-line'} />
			) : !ticks || ticks.length === 0 || !price ? (
				<InfoBox message={'There is no liquidity data.'} icon={'ri-bar-chart-grouped-line'} />
			) : (
				<div
					style={{
						position: 'relative',
						width: '100%',
						maxHeight: '200px',
						justifyContent: 'center',
						alignContent: 'center',
					}}
				>
					<Chart
						data={{ series: ticks, current: Number(price) }}
						dimensions={{ width: 560, height: 200 }}
						margins={{ top: 10, right: 2, bottom: 20, left: 0 }}
						styles={{
							area: {
								selection: `var(--shadow)`,
							},
							brush: {
								handle: {
									west: `${tokenAColor}`,
									east: `${tokenBColor}`,
								},
							},
						}}
						interactive={interactive}
						brushLabels={brushLabelValue}
						brushDomain={brushDomain}
						onBrushDomainChange={onBrushDomainChangeEnded}
						zoomLevels={ZOOM_LEVELS[feeAmount.toString() ?? '3000']}
						ticksAtLimit={ticksAtLimit}
					/>
				</div>
			)}
		</div>
	);
}
