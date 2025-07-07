import axiosInstance from './axiosInstance';

export const setTokenHeader = (token: string) => {
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getTokenHeader = (): string | undefined => {
  const authHeader = axiosInstance.defaults.headers.common['Authorization'];
  return authHeader ? String(authHeader) : undefined;
};
