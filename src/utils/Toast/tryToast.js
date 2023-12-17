import { toast } from 'react-toastify';

export const tryToast = async (callback) => {
  try {
    await callback();
  } catch (err) {
    toast.error(err.message);
  }
};
