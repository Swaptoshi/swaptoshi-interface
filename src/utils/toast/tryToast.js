import { toast } from 'react-toastify';

export const tryToast = async (identifier, callback, errf, final) => {
	try {
		await callback();
	} catch (err) {
		console.error(`${identifier}: (${err})`);
		toast.error(`${identifier}`);
		errf ? errf(err) : {};
	} finally {
		final ? final() : {};
	}
};
