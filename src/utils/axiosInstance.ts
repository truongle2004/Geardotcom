import axios, { HttpStatusCode } from 'axios';
import { getAccessToken, getUserInfo, logout } from './auth';
import { stringUtils } from './stringUtils';
import type { UserInfo } from '@/types';

let cachedToken: string | null = null;
let cachedUserInfo: UserInfo | null = null;

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8222',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000
});

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      if (cachedUserInfo === null) cachedUserInfo = await getUserInfo();
      if (
        cachedUserInfo !== null &&
        stringUtils.isNotNullAndEmpty(cachedUserInfo.sub)
      ) {
        config.headers['X-USER-ID'] = cachedUserInfo.sub;
      }

      if (cachedToken === null) cachedToken = await getAccessToken();
      if (cachedToken !== null && stringUtils.isNotNullAndEmpty(cachedToken)) {
        config.headers['Authorization'] = `Bearer ${cachedToken}`;
      }

      return config;
    } catch (err) {
      return Promise.reject(err);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // if (
    //   error.response &&
    //   error.response.status === HttpStatusCode.Unauthorized
    // ) {
    //   logout();
    // }
    return Promise.reject(error);
  }
);

export default axiosInstance;
