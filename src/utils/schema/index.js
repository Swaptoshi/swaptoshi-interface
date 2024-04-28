import { exactInputCommandSchema } from './exact_input_command';
import { exactOutputCommandSchema } from './exact_output_command';
import { burnCommandSchema } from './burn_command';
import { collectCommandSchema } from './collect_command';
import { createPoolCommandSchema } from './create_pool_command';
import { decreaseLiquidityCommandSchema } from './decrease_liquidity_command';
import { exactInputSingleCommandSchema } from './exact_input_single_command';
import { exactOutputSingleCommandSchema } from './exact_output_single_command';
import { increaseLiquidityCommandSchema } from './increase_liquidity_command';
import { tokenCreateCommandSchema } from './token_create_command';
import { tokenMintCommandSchema } from './token_mint_command';
import { tokenBurnCommandSchema } from './token_burn_command';
import { mintCommandSchema } from './mint_command';
import { treasurifyCommandSchema } from './treasurify_command';

export const knownSchema = {
	[`tokenFactory:tokenCreate`]: tokenCreateCommandSchema,
	[`tokenFactory:tokenMint`]: tokenMintCommandSchema,
	[`tokenFactory:tokenBurn`]: tokenBurnCommandSchema,
	[`dex:createPool`]: createPoolCommandSchema,
	[`dex:mint`]: mintCommandSchema,
	[`dex:burn`]: burnCommandSchema,
	[`dex:collect`]: collectCommandSchema,
	[`dex:decreaseLiquidity`]: decreaseLiquidityCommandSchema,
	[`dex:increaseLiquidity`]: increaseLiquidityCommandSchema,
	[`dex:exactInput`]: exactInputCommandSchema,
	[`dex:exactInputSingle`]: exactInputSingleCommandSchema,
	[`dex:exactOutput`]: exactOutputCommandSchema,
	[`dex:exactOutputInput`]: exactOutputSingleCommandSchema,
	[`dex:treasurify`]: treasurifyCommandSchema,
};
