import { burnTokenCommandSchema } from './token_burn_command';
import { exactInputCommandSchema } from './exact_input_command';
import { exactOutputCommandSchema } from './exact_output_command';
import { burnCommandSchema } from './burn_command';
import { collectCommandSchema } from './collect_command';
import { createTokenCommandSchema } from './create_command';
import { createPoolCommandSchema } from './create_pool_command';
import { decreaseLiquidityCommandSchema } from './decrease_liquidity_command';
import { exactInputSingleCommandSchema } from './exact_input_single_command';
import { exactOutputSingleCommandSchema } from './exact_output_single_command';
import { increaseLiquidityCommandSchema } from './increase_liquidity_command';
import { mintTokenCommandSchema } from './token_mint_command';
import { mintCommandSchema } from './mint_command';
import { treasurifyCommandSchema } from './treasurify_command';

export const knownSchema = {
	[`tokenFactory:create`]: createTokenCommandSchema,
	[`tokenFactory:mint`]: mintTokenCommandSchema,
	[`tokenFactory:burn`]: burnTokenCommandSchema,
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
