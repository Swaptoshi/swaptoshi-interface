import { encodeParam } from './params/encode';

export const transformTransaction = async transaction => {
	const transformed = { ...transaction };
	transformed.senderPublicKey = Buffer.from(transformed.senderPublicKey, 'hex');
	transformed.fee = BigInt(transformed.fee);
	transformed.nonce = BigInt(transformed.nonce);
	transformed.signatures = transformed.signatures.map(t => Buffer.from(t, 'hex'));
	transformed.params = await encodeParam(
		transformed.module,
		transformed.command,
		transformed.params,
	);
	return transformed;
};
