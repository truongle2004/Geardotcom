'use client';

import { addProductToCart } from '@/apis/cart';
import {
    getAllProductCategoryAPI,
    getProductByCategoryAPI
} from '@/apis/product';
import DialogAuthAlert from '@/components/DialogAlert';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorAlert from '@/components/NoDataAlert';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Constant } from '@/constant/constant';
import { Product } from '@/types';
import { stringUtils } from '@/utils/stringUtils';
import { toastError, toastSuccess } from '@/utils/toastify';
import { useKeycloak } from '@react-keycloak/web';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { keycloak } = useKeycloak();
  const [pageNumber, setPageNumber] = useState(Constant.DEFAULT_PAGE_NUMBER);
  const { category } = useParams<{ category: string }>();
  const [listProduct, setListProduct] = useState<Product[]>([]);

  const { data, isLoading, isSuccess, isLoadingError } = useQuery({
    queryKey: ['collections', pageNumber, category],
    queryFn: () =>
      getProductByCategoryAPI(pageNumber, Constant.DEFAULT_PAGE_SIZE, category),
    enabled: !!category,
    placeholderData: keepPreviousData
  });

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  useEffect(() => {
    if (isSuccess) {
      setListProduct((prev) => [...prev, ...(data?.data?.content || [])]);
    }
  }, [data?.data?.content, isSuccess]);

  const handleLoadmore = () => {
    if (
      data?.data?.totalPages !== undefined &&
      pageNumber < data?.data?.totalPages
    ) {
      setPageNumber(pageNumber + 1);
    }
  };

  const { mutateAsync: addProductToCartMutation } = useMutation({
    mutationFn: (data: { productId: string; quantity: number }) =>
      addProductToCart(data.productId, data.quantity),
    onSuccess: (response) => {
      if (stringUtils.isNotNullAndEmpty(response.data)) {
        toastSuccess(response.data);
      }
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toastError(error.response?.data);
      }
    }
  });

  const handleAddProductToCart = async (
    productId: string,
    quantity: number
  ) => {
    if (!keycloak.authenticated) {
      handleOpenDialog();
      return;
    }

    await addProductToCartMutation({ productId, quantity });
  };
  const { data: categories } = useQuery({
    queryKey: ['collections'],
    queryFn: getAllProductCategoryAPI
  });

  return (
    <>
      <DialogAuthAlert isOpen={isOpenDialog} onClose={handleCloseDialog} />
      <div className="min-h-screen">
        {isLoading && <LoadingOverlay />}
        {isLoadingError ? (
          <ErrorAlert />
        ) : (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <p>Khám phá hàng gaming chất lượng cao</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Button variant="outline" size="sm">
                Tất cả
              </Button>

              {(categories?.data?.length as number) > 0 &&
                categories?.data?.map((category) => (
                  <Button variant="outline" size="sm" key={category.id}>
                    {category.name}
                  </Button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listProduct?.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  handleAddToCart={handleAddProductToCart}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="flex justify-center mt-12">
              <Button size="lg" variant="outline" onClick={handleLoadmore}>
                {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default ProductsPage;
