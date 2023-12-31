const cryptography = require('@liskhq/lisk-cryptography');

export function tokenToColorHex(token) {
  return cryptography.utils.hash(Buffer.from(token, 'hex')).subarray(0, 3).toString('hex');
}
