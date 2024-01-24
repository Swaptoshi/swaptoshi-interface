import React from 'react';
import SwitchBox from './SwitchBox';

export default function TokenSwitchBox({
	containerClassName,
	className,
	tokenA,
	tokenB,
	onSwitch,
	style,
}) {
	const [token0, setToken0] = React.useState();
	const [token1, setToken1] = React.useState();

	React.useEffect(() => {
		if (tokenA && tokenB) {
			setToken0(tokenA.tokenId < tokenB.tokenId ? tokenA : tokenB);
			setToken1(tokenA.tokenId < tokenB.tokenId ? tokenB : tokenA);
		}
	}, [tokenA, tokenB]);

	return token0 && token1 ? (
		<div style={style} className={containerClassName}>
			<SwitchBox
				style={{ width: '100px' }}
				className={className}
				unselectedBackgroundColor={'var(--surface-2)'}
				unselectedTextColor={'var(--text-clr)'}
				selectedTextColor={'var(--color-white)'}
				selectedBackgroundColor={'var(--surface-1)'}
				value={tokenA}
				items={[
					{
						value: token1,
						onClick: () => {
							if (tokenA === token1) return;
							onSwitch();
						},
						component: <div style={{ fontSize: '12px' }}>{token1.symbol.toUpperCase()}</div>,
					},
					{
						value: token0,
						onClick: () => {
							if (tokenA === token0) return;
							onSwitch();
						},
						component: <div style={{ fontSize: '12px' }}>{token0.symbol.toUpperCase()}</div>,
					},
				]}
			/>
		</div>
	) : undefined;
}
