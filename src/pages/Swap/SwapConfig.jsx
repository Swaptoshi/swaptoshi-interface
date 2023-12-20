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
								backgroundColor: 'var(--yellow-transparent)',
								padding: '2px 8px',
								alignItems: 'center',
							}}
						>
							<div style={{ color: 'var(--text-clr)', fontSize: '14px' }}>1.0% slippage</div>
							<i className="ri-settings-3-fill gear-icon"></i>
						</div>
					</button>
				}
			>
				<div>
					<div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
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
							<div style={{ fontSize: '14px' }}>Auto</div>
							<i className="ri-arrow-down-s-line" style={{ fontSize: '20px' }}></i>
						</div>
					</div>

					<div style={{ display: 'flex' }}>
						<SwitchBox
							style={{ flex: 1 }}
							value={isSlippageAuto}
							items={[
								{
									value: true,
									onClick: () => setIsSlippageAuto(true),
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
								placeholder="0.5"
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
							Slippage below 0.05% may result in a failed transaction
						</div>
					</div>
				</div>

				<div style={{ height: '1px', backgroundColor: 'var(--border)', margin: '12px 0px' }} />

				<div>
					<div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
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
							<div style={{ fontSize: '14px' }}>Auto</div>
							<i className="ri-arrow-down-s-line" style={{ fontSize: '20px' }}></i>
						</div>
					</div>

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
							placeholder="10"
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
						<div style={{ color: 'var(--color-white)', flex: 1, textAlign: 'center' }}>minutes</div>
					</div>

					<div style={{ margin: '4px 0px' }} />
				</div>
			</Dialog>
		</div>
	);
}
