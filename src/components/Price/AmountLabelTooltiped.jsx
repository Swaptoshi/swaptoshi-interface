import React from 'react';
import { AMOUNT_LABEL_SMALLEST } from '../../utils/constants/price';
import Decimal from 'decimal.js';
import Tooltip from '../Tooltip/Tooltip';

export default function AmountLabelTooltiped({
	amount,
	decimal,
	symbol,
	limit,
	precision,
	...props
}) {
	const amountUnit = React.useMemo(
		() =>
			amount !== undefined && decimal !== undefined
				? new Decimal(amount).div(10 ** Number(decimal))
				: '0',
		[amount, decimal],
	);
	const amountUnitWithPrecision = React.useMemo(
		() => (amountUnit ? new Decimal(amountUnit).toFixed(precision ?? decimal) : '0'),
		[amountUnit, decimal, precision],
	);
	const lowestLimit = React.useMemo(() => limit ?? AMOUNT_LABEL_SMALLEST, [limit]);
	const tooSmall = React.useMemo(
		() =>
			amountUnit !== '0' && lowestLimit !== undefined
				? new Decimal(amountUnit).lt(lowestLimit)
				: undefined,
		[lowestLimit, amountUnit],
	);

	return tooSmall === undefined ? null : decimal !== undefined && symbol !== undefined ? (
		<div {...props}>
			<Tooltip content={`${amountUnit} ${symbol.toUpperCase()}`}>
				{tooSmall
					? Number(amount) === 0
						? '0'
						: `<${AMOUNT_LABEL_SMALLEST}`
					: amountUnitWithPrecision}
			</Tooltip>
		</div>
	) : (
		<div {...props}>Error</div>
	);
}
