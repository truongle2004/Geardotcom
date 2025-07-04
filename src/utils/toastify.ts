import { toast } from 'react-toastify';

export const toastSuccess = (message: string, options?: any) => {
  toast.success(message, options);
};

export const toastWarning = (message: string, options?: any) => {
  toast.warning(message, options);
};

export const toastError = (message: string, options?: any) => {
  toast.error(message, options);
};
