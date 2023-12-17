import { toast } from 'react-toastify';

export const tryToast = async (callback, errf, final) => {
	try {
		await callback();
	} catch (err) {
		console.error(err);
		toast.error(err.message);
		errf ? errf(err) : {};
	} finally {
		final ? final() : {};
	}
};
