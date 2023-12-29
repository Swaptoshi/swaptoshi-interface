import React from 'react';
import Dialog from '../../components/Tooltip/Dialog';
import Tooltip from '../../components/Tooltip/Tooltip';
import SwitchBox from '../../components/SwitchBox/SwitchBox';

export default function SwapConfig({
	show,
	onClick,
	isSlippageAuto,
	setIsSlippageAuto,
	slippage,
	onSlippageInputChange,
	deadline,
	onDeadlineInputChange,
}) {
	const [slippageShow, setSlippageShow] = React.useState(false);
	const [deadlineShow, setDeadlineShow] = React.useState(false);

	return (
		<div className="gear">
			<Dialog
				show={show}
				style={{ right: 0, width: '300px', top: '45px' }}
				anchor={
					<button
						className="gear-btn"
						onClick={onClick}
						style={{ borderRadius: '24px', overflow: 'hidden' }}
					>
						<div
							style={{
								display: 'flex',
								backgroundColor:
									slippage && (slippage < 0.05 || slippage > 1)
										? 'var(--yellow-transparent)'
										: !isSlippageAuto && slippage
											? 'var(--card-inside-color)'
											: undefined,
								padding: '2px 8px',
								alignItems: 'center',
							}}
						>
							{!isSlippageAuto && slippage ? (
								<div style={{ color: 'var(--text-clr)', fontSize: '14px' }}>
									{slippage}% slippage
								</div>
							) : null}
							<i className="ri-settings-3-fill gear-icon"></i>
						</div>
					</button>
				}
			>
				<div>
					<div
						style={{ display: 'flex', alignItems: 'center', margin: '8px 0', cursor: 'pointer' }}
						onClick={() => setSlippageShow(s => !s)}
					>
						<div
							style={{
								flex: 1,
								color: 'var(--text-clr)',
								display: 'flex',
								fontSize: '14px',
							}}
						>
							Max. slippage
							<Tooltip
								content={
									'Your transaction will revert if the price changes unfavorably by more than this percentage.'
								}
							>
								<i
									style={{ margin: '0 2px', color: 'var(--text-clr)' }}
									className="ri-information-line"
								></i>
							</Tooltip>
						</div>
						<div
							style={{
								color: 'var(--color-white)',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<div style={{ fontSize: '14px' }}>
								{isSlippageAuto
									? 'Auto'
									: `${
											slippage
												? slippage
												: Number(process.env.REACT_APP_DEFAULT_DEFAULT_SLIPPAGE ?? 0.5)
										}%`}
							</div>
							{slippageShow ? (
								<i className="ri-arrow-up-s-line" style={{ fontSize: '20px' }}></i>
							) : (
								<i className="ri-arrow-down-s-line" style={{ fontSize: '20px' }}></i>
							)}
						</div>
					</div>

					{slippageShow ? (
						<div style={{ display: 'flex' }}>
							<SwitchBox
								style={{ flex: 1 }}
								value={isSlippageAuto}
								items={[
									{
										value: true,
										onClick: () => {
											setIsSlippageAuto(true);
											onSlippageInputChange({ target: { value: '' } });
										},
										component: 'Auto',
									},
									{
										value: false,
										onClick: () => setIsSlippageAuto(false),
										component: 'Custom',
									},
								]}
							/>
							<div style={{ margin: '0px 4px' }} />
							<div
								style={{
									display: 'flex',
									flex: 1,
									alignItems: 'center',
									maxWidth: '30%',
									outline: 'var(--border) solid 1px',
									borderRadius: '14px',
									padding: '0px 8px',
								}}
							>
								<input
									placeholder={process.env.REACT_APP_DEFAULT_DEFAULT_SLIPPAGE ?? '0.5'}
									inputMode="numeric"
									autoComplete="off"
									autoCorrect="off"
									spellCheck="false"
									value={slippage}
									type={'number'}
									onChange={onSlippageInputChange}
									style={{
										width: '90%',
										border: 'none',
										outline: 'none',
										textAlign: 'end',
										backgroundColor: 'transparent',
									}}
								/>
								<div style={{ margin: '0px 4px' }} />
								<div style={{ color: 'var(--color-white)', flex: 1, textAlign: 'center' }}>%</div>
							</div>
						</div>
					) : null}

					{slippage && (slippage < 0.05 || slippage > 1) ? (
						<div
							style={{
								display: 'flex',
								color: 'var(--yellow)',
								padding: '0px 8px',
								alignItems: 'center',
								margin: '8px 0px',
							}}
						>
							<i className="ri-alert-line" style={{ fontSize: '20px', marginRight: '8px' }}></i>
							<div style={{ fontSize: '12px' }}>
								{slippage < 0.05
									? 'Slippage below 0.05% may result in a failed transaction'
									: slippage > 1
										? 'Your transaction may be frontrun and result in an unfavorable trade.'
										: ''}
							</div>
						</div>
					) : null}
				</div>

				<div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '12px 0px' }} />

				<div>
					<div
						style={{ display: 'flex', alignItems: 'center', margin: '8px 0', cursor: 'pointer' }}
						onClick={() => setDeadlineShow(s => !s)}
					>
						<div
							style={{
								flex: 1,
								color: 'var(--text-clr)',
								display: 'flex',
								fontSize: '14px',
							}}
						>
							Transaction deadline
							<Tooltip
								content={
									'Your transaction will revert if it is pending for more than this period of time.'
								}
							>
								<i
									style={{ margin: '0 2px', color: 'var(--text-clr)' }}
									className="ri-information-line"
								></i>
							</Tooltip>
						</div>
						<div
							style={{
								color: 'var(--color-white)',
								display: 'flex',
								alignItems: 'center',
							}}
						>
							<div style={{ fontSize: '14px' }}>
								{deadline ? deadline : Number(process.env.REACT_APP_DEFAULT_DEADLINE_MINUTE ?? 10)}m
							</div>
							{deadlineShow ? (
								<i className="ri-arrow-up-s-line" style={{ fontSize: '20px' }}></i>
							) : (
								<i className="ri-arrow-down-s-line" style={{ fontSize: '20px' }}></i>
							)}
						</div>
					</div>

					{deadlineShow ? (
						<div
							style={{
								display: 'flex',
								flex: 1,
								alignItems: 'center',
								outline: 'var(--border) solid 1px',
								borderRadius: '14px',
								padding: '0px 8px',
								height: '40px',
							}}
						>
							<input
								placeholder={process.env.REACT_APP_DEFAULT_DEADLINE_MINUTE ?? '10'}
								inputMode="numeric"
								autoComplete="off"
								autoCorrect="off"
								spellCheck="false"
								value={deadline}
								type={'number'}
								onChange={onDeadlineInputChange}
								style={{
									width: '90%',
									border: 'none',
									outline: 'none',
									textAlign: 'end',
									backgroundColor: 'transparent',
								}}
							/>
							<div style={{ margin: '0px 4px' }} />
							<div style={{ color: 'var(--color-white)', flex: 1, textAlign: 'center' }}>
								minutes
							</div>
						</div>
					) : null}

					<div style={{ margin: '4px 0px' }} />
				</div>
			</Dialog>
		</div>
	);
}
