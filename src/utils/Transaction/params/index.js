export const transformParam = (module, command, params) => {
	switch (module) {
		case 'dex':
			switch (command) {
				case 'mint':
					return {
						token0: Buffer.from(params.token0, 'hex'),
						token1: Buffer.from(params.token1, 'hex'),
						fee: params.fee.toString(),
						tickLower: params.tickLower.toString(),
						tickUpper: params.tickUpper.toString(),
						amount0Desired: params.amount0Desired.toString(),
						amount1Desired: params.amount1Desired.toString(),
						amount0Min: params.amount0Min.toString(),
						amount1Min: params.amount1Min.toString(),
						recipient: Buffer.from(params.recipient, 'hex'),
						deadline: params.deadline.toString(),
					};
				case 'burn':
					return {
						poolAddress: Buffer.from(params.poolAddress, 'hex'),
						tokenId: params.tokenId.toString(),
					};
				case 'collect':
					return {
						poolAddress: Buffer.from(params.poolAddress, 'hex'),
						tokenId: params.tokenId.toString(),
						recipient: Buffer.from(params.recipient, 'hex'),
						amount0Max: params.amount0Max.toString(),
						amount1Max: params.amount1Max.toString(),
					};
				case 'createPool':
					return {
						tokenA: Buffer.from(params.tokenA, 'hex'),
						tokenASymbol: params.tokenASymbol.toString(),
						tokenADecimal: Number(params.tokenADecimal),
						tokenB: Buffer.from(params.tokenB, 'hex'),
						tokenBSymbol: params.tokenBSymbol.toString(),
						tokenBDecimal: Number(params.tokenBDecimal),
						fee: params.fee.toString(),
						sqrtPriceX96: params.sqrtPriceX96.toString(),
					};
				case 'decreaseLiquidity':
					return {
						poolAddress: Buffer.from(params.poolAddress, 'hex'),
						tokenId: params.tokenId.toString(),
						liquidity: params.liquidity.toString(),
						amount0Min: params.amount0Min.toString(),
						amount1Min: params.amount1Min.toString(),
						deadline: params.deadline.toString(),
					};
				case 'increaseLiquidity':
					return {
						poolAddress: Buffer.from(params.poolAddress, 'hex'),
						tokenId: params.tokenId.toString(),
						amount0Desired: params.amount0Desired.toString(),
						amount1Desired: params.amount1Desired.toString(),
						amount0Min: params.amount0Min.toString(),
						amount1Min: params.amount1Min.toString(),
						deadline: params.deadline.toString(),
					};
				case 'exactInput':
					return {
						path: Buffer.from(params.path, 'hex'),
						recipient: Buffer.from(params.recipient, 'hex'),
						deadline: params.deadline.toString(),
						amountIn: params.amountIn.toString(),
						amountOutMinimum: params.amountOutMinimum.toString(),
					};
				case 'exactInputSingle':
					return {
						tokenIn: Buffer.from(params.tokenIn, 'hex'),
						tokenOut: Buffer.from(params.tokenOut, 'hex'),
						fee: params.fee.toString(),
						recipient: Buffer.from(params.recipient, 'hex'),
						deadline: params.deadline.toString(),
						amountIn: params.amountIn.toString(),
						amountOutMinimum: params.amountOutMinimum.toString(),
						sqrtPriceLimitX96: params.sqrtPriceLimitX96.toString(),
					};
				case 'exactOutput':
					return {
						path: Buffer.from(params.path, 'hex'),
						recipient: Buffer.from(params.recipient, 'hex'),
						deadline: params.deadline.toString(),
						amountOut: params.amountOut.toString(),
						amountInMaximum: params.amountInMaximum.toString(),
					};
				case 'exactOutputSingle':
					return {
						tokenIn: Buffer.from(params.tokenIn, 'hex'),
						tokenOut: Buffer.from(params.tokenOut, 'hex'),
						fee: params.fee.toString(),
						recipient: Buffer.from(params.recipient, 'hex'),
						deadline: params.deadline.toString(),
						amountOut: params.amountOut.toString(),
						amountInMaximum: params.amountInMaximum.toString(),
						sqrtPriceLimitX96: params.sqrtPriceLimitX96.toString(),
					};
				case 'treasurify':
					return {
						address: Buffer.from(params.address, 'hex'),
						token: Buffer.from(params.token, 'hex'),
					};
				default:
					throw new Error(`unknown command: ${command}`);
			}
		case 'tokenFactory':
			switch (command) {
				case 'create':
					return {
						amount: BigInt(params.amount),
					};
				case 'burn':
					return {
						tokenId: Buffer.from(params.tokenId, 'hex'),
						amount: BigInt(params.amount),
					};
				case 'mint':
					return {
						tokenId: Buffer.from(params.tokenId, 'hex'),
						amount: BigInt(params.amount),
					};
				default:
					throw new Error(`unknown command: ${command}`);
			}
		default:
			throw new Error(`unknown module: ${module}`);
	}
};
