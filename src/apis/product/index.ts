import { ApiEnum } from '@/enums/enums';
import type {
  ApiResponse,
  Category,
  PaginatedResponse,
  Product,
  ProductDetail,
  Vendor
} from '@/types';
import axiosInstance from '@/utils/axiosInstance';

const root = 'sale/products';

export const getProductAPI = async ({
  page,
  size,
  sort,
  category,
  direction,
  vendor,
  minPrice,
  maxPrice
}: {
  page: number;
  size: number;
  sort?: string;
  category?: string;
  direction?: string;
  vendor?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/${root}`, {
    params: {
      page,
      size,
      sort,
      category,
      direction,
      vendor,
      min: minPrice,
      max: maxPrice
    }
  });
};

export const getProductDetailAPI = async (
  id: string
): Promise<ApiResponse<ProductDetail>> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/${root}/${id}`);
};

export const getAllProductCategoryAPI = async (): Promise<
  ApiResponse<Category[]>
> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/${root}/categories`);
};

export const getAllVendor = async (): Promise<ApiResponse<Vendor[]>> => {
  return await axiosInstance.get(`${ApiEnum.API_V1}/${root}/vendors`);
};
