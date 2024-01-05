import React from 'react';

export default function TextAreaInput(props) {
	const { style, ...restProps } = props;

	let className =
		'NumericalInput__StyledInput-sc-e2342ddc-0 gZlbTK InputStepCounter__StyledInput-sc-98d37844-3 jgKZAt rate-input-0 ';

	if (props.className) className += props.className;

	return (
		<div
			className="sc-bczRLJ Card-sc-8b665604-0 Card__OutlineCard-sc-8b665604-5 InputStepCounter__FocusedOutlineCard-sc-98d37844-2 hJYFVB jlQAxw hapmMj hXXOVF"
			style={style}
		>
			<div className="InputStepCounter__InputRow-sc-98d37844-0 ddcmlg">
				<div className="Column__AutoColumn-sc-72c388fb-2 InputStepCounter__InputColumn-sc-98d37844-4 iHjCXw cVcAns">
					<textarea {...restProps} style={restProps.inputstyle} className={className} />
				</div>
			</div>
		</div>
	);
}
