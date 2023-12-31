import { codec } from '@liskhq/lisk-codec';
import { transformParam } from '.';
import { getSchema } from '../../../service/schemas';

export const encodeParam = async (module, command, params) => {
	const transformed = transformParam(module, command, params);
	const schema = await getSchema({ module, command, params });
	return codec.encode(schema, transformed);
};
