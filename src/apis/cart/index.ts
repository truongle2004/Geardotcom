import { ApiEnum, SortDirection } from '@/enums/enums';
import type { ApiResponse, CartItemType, PaginatedResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const addProductToCart = async (
  productId: string,
  quantity: number
): Promise<ApiResponse<string>> =>
  await axiosInstance.post(`${ApiEnum.API_V1}/sale/carts`, {
    productId,
    quantity
  });

export const deleteCartItem = async (
  ids: string[]
): Promise<ApiResponse<string>> => {
  const params = new URLSearchParams();
  ids.forEach((id) => params.append('ids', id));
  return await axiosInstance.delete(`${ApiEnum.API_V1}/sale/carts?${params.toString()}`);
};

export const getUserCartAPI = async (
  page: number,
  size: number,
  sortDirection: SortDirection = SortDirection.DESC
): Promise<ApiResponse<PaginatedResponse<CartItemType[]>>> =>
  await axiosInstance.get(`${ApiEnum.API_V1}/sale/carts`, {
    params: {
      page,
      size,
      direction: sortDirection
    }
  });
