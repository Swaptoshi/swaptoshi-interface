import React from 'react';
import { addByTick, normalizePriceByTick, subByTick } from '../../utils/Tick/price_tick';
import {
	decodePriceSqrt,
	decodeTickPrice,
	encodePriceSqrt,
	inversePriceSqrt,
} from '../../utils/Math/priceFormatter';
import { MAX_TICK, MIN_TICK } from '../../utils/Tick/tick_math';

export default function PriceInput({ value, disabled, setValue, title, subTitle }) {
	const onChange = React.useCallback(
		event => {
			const inputValue = event.target.value;

			if (inputValue === '') {
				setValue('');
				return;
			}

			if (/^[0-9]*[.,]?[0-9]*$/.test(inputValue)) {
				setValue(inputValue);
			}
		},
		[setValue],
	);

	const onBlur = React.useCallback(() => {
		if (value && value !== '0') {
			const normalized = normalizePriceByTick(value, 10);
			setValue(normalized);
		}
	}, [setValue, value]);

	const onPlus = React.useCallback(() => {
		const price = 1.36456456456;
		const sqrt = encodePriceSqrt(price, 1);

		const invertedPrice = price ** -1;
		const invertedsqrt = encodePriceSqrt(1, price);
		const fromInvertedSqrt = decodePriceSqrt(invertedsqrt);
		const fromInvertedSqrt2 = decodePriceSqrt(inversePriceSqrt(sqrt));

		console.log('check this', inversePriceSqrt(sqrt), invertedsqrt);
		console.log(invertedPrice, fromInvertedSqrt, fromInvertedSqrt2);

		if (value && value !== '0') {
			const added = addByTick(value, 10);
			setValue(added);
		} else {
			setValue(decodeTickPrice(MIN_TICK));
		}
	}, [setValue, value]);

	const onMinus = React.useCallback(() => {
		if (value && value !== '0') {
			const subtracted = subByTick(value, 10);
			setValue(subtracted);
		} else {
			setValue(decodeTickPrice(MAX_TICK));
		}
	}, [setValue, value]);

	return (
		<div
			className="sc-bczRLJ Card-sc-8b665604-0 Card__OutlineCard-sc-8b665604-5 InputStepCounter__FocusedOutlineCard-sc-98d37844-2 hJYFVB jlQAxw hapmMj hXXOVF"
			style={{ opacity: disabled ? 0.5 : 1 }}
		>
			<div className="InputStepCounter__InputRow-sc-98d37844-0 ddcmlg">
				<div className="Column__AutoColumn-sc-72c388fb-2 InputStepCounter__InputColumn-sc-98d37844-4 iHjCXw cVcAns">
					<div className="text__TextWrapper-sc-9327e48a-0 iJbhaU InputStepCounter__InputTitle-sc-98d37844-5 eRovVv css-9bv76i">
						{title}
					</div>
					<input
						disabled={disabled}
						className="NumericalInput__StyledInput-sc-e2342ddc-0 gZlbTK InputStepCounter__StyledInput-sc-98d37844-3 jgKZAt rate-input-0"
						fontSize="20px"
						inputMode="decimal"
						autoComplete="off"
						autoCorrect="off"
						type="text"
						pattern="^[0-9]*[.,]?[0-9]*$"
						placeholder={0}
						minLength={1}
						maxLength={79}
						spellCheck="false"
						value={value === undefined ? '' : value}
						onChange={onChange}
						onBlur={onBlur}
					/>
					<div className="text__TextWrapper-sc-9327e48a-0 iJbhaU InputStepCounter__InputTitle-sc-98d37844-5 eRovVv css-2qpl5c">
						{subTitle}
					</div>
				</div>
				<div className="Column__AutoColumn-sc-72c388fb-2 dCQVZu">
					<button
						disabled={disabled}
						data-testid="increment-price-range"
						onClick={onPlus}
						className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 InputStepCounter__SmallButton-sc-98d37844-1 hWKjgZ bdLEKg eKOJak"
					>
						<div className="text__TextWrapper-sc-9327e48a-0 blhgKn InputStepCounter__ButtonLabel-sc-98d37844-6 ojMTq css-15li2d9">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={18}
								height={18}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1={12} y1={5} x2={12} y2={19} />
								<line x1={5} y1={12} x2={19} y2={12} />
							</svg>
						</div>
					</button>
					<button
						disabled={disabled}
						data-testid="decrement-price-range"
						onClick={onMinus}
						className="sc-bczRLJ lfsInV Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 InputStepCounter__SmallButton-sc-98d37844-1 hWKjgZ bdLEKg eKOJak"
					>
						<div className="text__TextWrapper-sc-9327e48a-0 blhgKn InputStepCounter__ButtonLabel-sc-98d37844-6 ojMTq css-15li2d9">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width={18}
								height={18}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<line x1={5} y1={12} x2={19} y2={12} />
							</svg>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
