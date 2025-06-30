import { ApiEnum } from '@/enums/enums';
import { ApiResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

const root = '/sale/wishlist';

export const addProductToWishlist = async (
  productId: string
): Promise<ApiResponse<string>> => {
  return axiosInstance.post(`${ApiEnum.API_V1}${root}`, { productId });
};

// export const removeWishlist = async (productId: string) => {};
