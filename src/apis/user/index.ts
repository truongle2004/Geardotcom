import { Constant } from '@/constant/constant';
import { ApiEnum } from '@/enums/enums';
import type {
  ApiResponse,
  District,
  PaginatedResponse,
  Province,
  UserAddressRequest,
  UserAddressResponse,
  Ward
} from '@/types';
import axiosInstance from '@/utils/axiosInstance';

const root = '/user';
export const getDistrictAPI = (
  page: number = Constant.DEFAULT_PAGE_NUMBER,
  size: number = Constant.DEFAULT_PAGE_SIZE,
  provincode: number
): Promise<ApiResponse<PaginatedResponse<District[]>>> => {
  return axiosInstance.get(`${ApiEnum.API_V1}${root}/districts/${provincode}`, {
    params: {
      page,
      size
    }
  });
};

export const getWardAPI = (
  page: number = Constant.DEFAULT_PAGE_NUMBER,
  size: number = Constant.DEFAULT_PAGE_SIZE,
  districtCode: number
): Promise<ApiResponse<PaginatedResponse<Ward[]>>> => {
  return axiosInstance.get(`${ApiEnum.API_V1}${root}/wards/${districtCode}`, {
    params: {
      page,
      size
    }
  });
};

export const getProvinceAPI = (
  page: number = Constant.DEFAULT_PAGE_NUMBER,
  size: number = Constant.DEFAULT_PAGE_SIZE
): Promise<ApiResponse<PaginatedResponse<Province[]>>> => {
  return axiosInstance.get(`${ApiEnum.API_V1}${root}/provinces`, {
    params: {
      page,
      size
    }
  });
};

export const updateUserAddressAPI = (
  data: UserAddressRequest
): Promise<ApiResponse<string>> => {
  return axiosInstance.put(`${ApiEnum.API_V1}${root}/address`, data);
};

export const getUserAddressAPI = (): Promise<
  ApiResponse<UserAddressResponse>
> => {
  return axiosInstance.get(`${ApiEnum.API_V1}${root}/address`);
};
