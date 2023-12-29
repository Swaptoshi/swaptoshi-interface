import React from 'react';
import { useChain } from '../../context/ChainProvider';
import Loader from '../Loader';
import { useDebouncedCallback } from 'use-debounce';
import * as env from '../../utils/config/env';

const feeDescriptionMap = {
	[500]: 'Best for stable pairs.',
	[3000]: 'Best for most pairs.',
	[10000]: 'Best for exotic pairs.',
};

export default function PoolFeeSelector({ selected, onSelect, onLoad }) {
	const { selectedService, dexConfig } = useChain();

	const [isLoading, setIsLoading] = React.useState(true);
	const [collapsed, setCollapsed] = React.useState(false);

	const handleButtonHide = React.useCallback(() => {
		setCollapsed(s => !s);
	}, []);

	const fetchDexConfig = useDebouncedCallback(async config => {
		if (!config) return;
		if (config) {
			onLoad && onLoad(config.feeAmountTickSpacing);
		}
		if (env.DEFAULT_FEE_TIER) {
			const matched = config.feeAmountTickSpacing.find(t => t[0] === env.DEFAULT_FEE_TIER);
			onSelect && onSelect(matched);
		}
		setIsLoading(false);
	}, Number(env.EFFECT_DEBOUNCE_WAIT));

	React.useEffect(() => {
		fetchDexConfig(dexConfig);
	}, [dexConfig, fetchDexConfig, onLoad, onSelect, selectedService]);

	return (
		<div className="Column__AutoColumn-sc-72c388fb-2 ereioh">
			{!isLoading ? (
				<div
					disabled=""
					className={`Column__AutoColumn-sc-72c388fb-2 styled__DynamicSection-sc-a3e32a7b-2 erfjwt isLiqudity token-selected`}
				>
					<div className="sc-bczRLJ Card-sc-8b665604-0 FeeSelector__FocusedOutlineCard-sc-2b537477-0 hJYFVB jlQAxw jgrgoQ">
						<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
							<div
								id="add-liquidity-selected-fee"
								className="Column__AutoColumn-sc-72c388fb-2 gXqkQO"
							>
								<div className="text__TextWrapper-sc-9327e48a-0 blhgKn css-1lohbqv">
									{selected ? `${selected / 10000}%` : 'Select'} fee tier
								</div>
								<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
									{selected ? feeDescriptionMap[selected] : 'The % you will earn in fees.'}
								</div>
							</div>
							<button
								width="auto"
								className="sc-bczRLJ cBKomN Button__BaseButton-sc-4f96dcd8-1 Button__ButtonGray-sc-4f96dcd8-5 ixVlAp jAJJVP"
								onClick={handleButtonHide}
								style={{ borderRadius: '24px', width: '72px' }}
							>
								{collapsed ? 'Hide' : 'Edit'}
							</button>
						</div>
					</div>
					{collapsed && (
						<div className="FeeSelector__Select-sc-2b537477-1 dpNkPS">
							{dexConfig && dexConfig.feeAmountTickSpacing
								? dexConfig.feeAmountTickSpacing.map(fees => {
										return (
											<button
												key={fees[0]}
												onClick={() => onSelect(fees)}
												style={{
													border: '1px solid var(--border)',
													padding: '16px',
													borderRadius: '16px',
													overflow: 'hidden',
													backgroundColor:
														Number(selected) === Number(fees[0])
															? 'var(--card-inside-color)'
															: undefined,
												}}
												className="sc-bczRLJ lbXqUa Button__BaseButton-sc-4f96dcd8-1 Button__ButtonOutlined-sc-4f96dcd8-7 eOoGds aQTri"
											>
												<div className="sc-bczRLJ Row-sc-34df4f97-0 Row__RowBetween-sc-34df4f97-1 hJYFVB gOYHMo BkVYr">
													<div className="Column__AutoColumn-sc-72c388fb-2 ezHOjM">
														<div className="Column__AutoColumn-sc-72c388fb-2 gajsee">
															<div className="text__TextWrapper-sc-9327e48a-0 blhgKn FeeOption__ResponsiveText-sc-6b7ccec1-0 fYKQxG css-1lohbqv">
																{fees[0] / 10000}%
															</div>
															<div className="text__TextWrapper-sc-9327e48a-0 fbSdRZ css-fczr0v">
																{feeDescriptionMap[fees[0]]}
															</div>
														</div>
													</div>
												</div>
											</button>
										);
									})
								: null}
						</div>
					)}
				</div>
			) : (
				<div
					style={{
						border: '1px solid var(--border)',
						width: '100%',
						height: '80px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: '24px',
						overflow: 'hidden',
					}}
				>
					<Loader size={30} />
				</div>
			)}
		</div>
	);
}
