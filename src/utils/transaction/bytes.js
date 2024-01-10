import { codec } from '@liskhq/lisk-codec';
import { transformTransaction } from './transformer';
import * as cryptography from '@liskhq/lisk-cryptography';
import { transactionSchema } from '../schema/transactionSchema';

export const getTransactionBytes = async (transaction, fillSignature, fillId) => {
	const tx = { ...transaction };
	if (fillSignature && tx.signatures.length === 0) {
		tx.signatures = [Buffer.alloc(64)];
	}
	if (fillId && tx.id === undefined) {
		tx.id = cryptography.utils.hash(
			codec.encode(transactionSchema, await transformTransaction(tx)),
		);
	}
	return codec.encode(transactionSchema, await transformTransaction(tx));
};
