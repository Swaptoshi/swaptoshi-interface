import { codec } from '@klayr/codec';
import { getSchema } from '../../../service/schemas';

export const encodeParam = async (module, command, params) => {
	if (Buffer.isBuffer(params)) return params;
	const schema = await getSchema({ module, command, params });
	return codec.encodeJSON(schema, params);
};
