const { crc32 } = require('crc');
const Vibrant = require('node-vibrant');

export async function tokenToColorHex(token, src, config) {
	const hash = crc32(token);

	const hue =
		config.nftPositionColorRange.hue[0] +
		(hash % (config.nftPositionColorRange.hue[1] - config.nftPositionColorRange.hue[0]));
	const saturation =
		config.nftPositionColorRange.saturation[0] +
		(hash %
			(config.nftPositionColorRange.saturation[1] - config.nftPositionColorRange.saturation[0]));
	const lightness =
		config.nftPositionColorRange.lightness[0] +
		(hash %
			(config.nftPositionColorRange.lightness[1] - config.nftPositionColorRange.lightness[0]));

	let color = hslToHex(hue, saturation, lightness);

	if (src) {
		try {
			color = (await Vibrant.from(src).getPalette()).Vibrant.hex;
		} catch {
			/* empty */
		}
	}

	return color;
}

function hslToHex(h, s, l) {
	s /= 100;
	l /= 100;

	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;
	let r = 0;
	let g = 0;
	let b = 0;

	if (h >= 0 && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (h >= 300 && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	// eslint-disable-next-line no-bitwise
	return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
