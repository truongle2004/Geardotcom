import type {
  PaginatedResponse,
  Category,
  Product,
  ProductDetail,
  ApiResponse
} from '@/types';
import axiosInstance from '@/utils/axiosInstance';
import { ApiEnum, SortDirection } from '@/enums/enums';

export const getProductByCategoryAPI = async (
  page: number,
  size: number,
  category: string,
  sortDirection: SortDirection = SortDirection.DESC
): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/sale/products`, {
    params: {
      page,
      size,
      category,
      direction: sortDirection
    }
  });
};


export const getProductDetailAPI = async (
  id: string
): Promise<ApiResponse<ProductDetail>> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/sale/products/${id}`);
};

export const getAllProductCategoryAPI = async (): Promise<
  ApiResponse<Category[]>
> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/sale/products/categories`);
};
