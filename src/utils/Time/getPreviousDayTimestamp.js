export const getPreviousDayTimestamp = day => {
	const today = new Date(new Date().toISOString().split('T')[0]).getTime();
	const previousDay = today - day * 86400000;
	return previousDay;
};
