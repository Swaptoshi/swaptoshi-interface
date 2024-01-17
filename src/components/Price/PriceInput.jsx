import React from 'react';
import {
	addByTick,
	getMaxTick,
	getMinTick,
	normalizePriceByTick,
	subByTick,
} from '../../utils/tick/price_tick';
import { decodeTickPrice } from '../../utils/math/priceFormatter';
import { INFINITE, ZERO } from '../../utils/constants/tick';

export default function PriceInput({ value, disabled, setValue, title, subTitle, tickSpacing }) {
	const onChange = React.useCallback(
		event => {
			const inputValue = event.target.value;

			if (inputValue === INFINITE) {
				setValue(INFINITE);
				return;
			}

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
		try {
			if (value && value !== ZERO && value !== INFINITE) {
				const normalized = normalizePriceByTick(value, tickSpacing);
				setValue(normalized);
			}
		} catch {
			setValue('');
		}
	}, [setValue, tickSpacing, value]);

	const onPlus = React.useCallback(() => {
		if (value) {
			if (value === INFINITE) {
				setValue(decodeTickPrice(Number(getMinTick(tickSpacing)) + Number(tickSpacing)));
			}
			if (Number(value) === Number(ZERO)) {
				setValue(decodeTickPrice(Number(getMinTick(tickSpacing))));
			}
			if (value !== INFINITE && Number(value) !== Number(ZERO)) {
				const added = addByTick(value, tickSpacing);
				setValue(added);
			}
		}
	}, [setValue, tickSpacing, value]);

	const onMinus = React.useCallback(() => {
		if (value) {
			if (value === INFINITE) {
				setValue(decodeTickPrice(Number(getMaxTick(tickSpacing)) - Number(tickSpacing)));
			}
			if (Number(value) === Number(ZERO)) {
				setValue(decodeTickPrice(Number(getMaxTick(tickSpacing))));
			}
			if (value !== INFINITE && Number(value) !== Number(ZERO)) {
				const subtracted = subByTick(value, tickSpacing);
				setValue(subtracted);
			}
		}
	}, [setValue, tickSpacing, value]);

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
						style={{ width: '35px', height: '35px' }}
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
						style={{ width: '35px', height: '35px' }}
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
