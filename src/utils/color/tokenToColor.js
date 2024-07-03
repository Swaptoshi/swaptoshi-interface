const cryptography = require('@klayr/cryptography');
const Vibrant = require('node-vibrant');

export async function tokenToColorHex(token, src) {
	let color = `#${cryptography.utils
		.hash(Buffer.from(token, 'hex'))
		.subarray(0, 3)
		.toString('hex')}`;

	if (src) {
		try {
			color = (await Vibrant.from(src).getPalette()).Vibrant.hex;
		} catch {
			/* empty */
		}
	}

	return color;
}
