import { knownSchema } from '../utils/schema';
import { serviceGET } from './node';

export const getSchema = async (transaction, serviceUrl) => {
	if (knownSchema[`${transaction.module}:${transaction.command}`] !== undefined) {
		return knownSchema[`${transaction.module}:${transaction.command}`];
	}
	const pool = await serviceGET(`/api/v3/schemas`, serviceUrl);
	return pool.data.commands.find(
		t => t.moduleCommand === `${transaction.module}:${transaction.command}`,
	);
};
