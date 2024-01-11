import { toast } from 'react-toastify';
import * as env from '../config/env';

export const tryToast = async (identifier, callback, errf, final) => {
	try {
		await callback();
	} catch (err) {
		if (env.NODE_ENV === 'development') console.error(`${identifier}: (${err})`);
		toast.error(`${identifier}`);
		errf ? errf(err) : {};
	} finally {
		final ? final() : {};
	}
};
