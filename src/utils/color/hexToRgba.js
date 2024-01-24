export function hexToRgba(hex, alpha) {
	// Convert hex to RGB
	const bigint = parseInt(hex.slice(1), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	// Return RGBA string
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
