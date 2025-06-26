'use client';

import { addProductToCart } from '@/apis/cart';
import {
  getAllProductCategoryAPI,
  getProductByCategoryAPI
} from '@/apis/product';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorAlert from '@/components/NoDataAlert';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import UnAuthorizedAlert from '@/components/UnAuthorizedAlert';
import { Constant } from '@/constant/constant';
import { Category, Product } from '@/types';
import { stringUtils } from '@/utils/stringUtils';
import { toastError, toastSuccess } from '@/utils/toastify';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import keycloak from '@/config/keycloakConfig';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Filter,
  Grid,
  Tag,
  X
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const router = useRouter();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [pageNumber, setPageNumber] = useState(Constant.DEFAULT_PAGE_NUMBER);
  const { category } = useParams<{ category: string }>();
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [sortOption, setSortOption] = useState<{
    sort: string;
    direction: string;
    vendor: string;
    category: string;
  }>({
    sort: '',
    direction: '',
    vendor: '',
    category: category || ''
  });

  const handleButtonSort = (sort: string, direction: string) => {
    setSortOption((prev) => ({
      ...prev,
      sort,
      direction
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]); // Reset products when sorting changes
  };

  const onSelectedCategory = (categoryItem: Category) => {
    setSelectedCategory(categoryItem);
    const sort = {
      ...sortOption,
      category: categoryItem.handle
    };
    setSortOption(sort);
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]); // Reset products when category changes
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setSortOption((prev) => ({
      ...prev,
      category: category || ''
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
  };

  const clearSortFilter = () => {
    setSortOption((prev) => ({
      ...prev,
      sort: '',
      direction: ''
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
  };

  const { data, isLoading, isSuccess, isLoadingError } = useQuery({
    queryKey: ['products', pageNumber, sortOption],
    queryFn: () =>
      getProductByCategoryAPI({
        page: pageNumber,
        size: Constant.DEFAULT_PAGE_SIZE,
        category: sortOption.category,
        sort: sortOption.sort,
        direction: sortOption.direction
      }),
    enabled: true,
    placeholderData: keepPreviousData
  });

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  useEffect(() => {
    if (isSuccess && data?.data?.content) {
      if (pageNumber === 1) {
        setListProduct(data.data.content);
      } else {
        setListProduct((prev) => [...prev, ...data.data.content]);
      }
    }
  }, [data?.data?.content, isSuccess, pageNumber]);

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
    queryKey: ['categories'],
    queryFn: getAllProductCategoryAPI
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  const getSortIcon = () => {
    if (!sortOption.sort) return <ArrowUpDown className="w-4 h-4" />;
    return sortOption.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4" />
    ) : (
      <ArrowDown className="w-4 h-4" />
    );
  };

  const getSortLabel = () => {
    if (!sortOption.sort) return 'Sắp xếp';
    const sortLabels: { [key: string]: string } = {
      name: 'Tên',
      price: 'Giá',
      createdAt: 'Ngày tạo',
      updatedAt: 'Cập nhật'
    };
    const label = sortLabels[sortOption.sort] || sortOption.sort;
    const direction = sortOption.direction === 'asc' ? 'tăng dần' : 'giảm dần';
    return `${label} ${direction}`;
  };

  return (
    <>
      <UnAuthorizedAlert isOpen={isOpenDialog} onClose={handleCloseDialog} />
      <div className="min-h-screen">
        {isLoading && <LoadingOverlay />}
        {isLoadingError ? (
          <ErrorAlert />
        ) : (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Grid className="w-6 h-6 text-blue-600" />
                <h1 className="text-2xl font-bold">Sản phẩm Gaming</h1>
              </div>
              <p>Khám phá hàng gaming chất lượng cao</p>
            </div>

            {/* Filters */}
            <div className="rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Bộ lọc</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      {selectedCategory
                        ? selectedCategory.name
                        : 'Loại sản phẩm'}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {categories?.data?.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onClick={() => onSelectedCategory(item)}
                        className="cursor-pointer"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        {item.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Sort Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      {getSortIcon()}
                      {getSortLabel()}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuItem
                      onClick={() => handleButtonSort('name', 'asc')}
                      className="cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Tên A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleButtonSort('name', 'desc')}
                      className="cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Tên Z-A
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleButtonSort('price', 'asc')}
                      className="cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4 mr-2" />
                      Giá thấp đến cao
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleButtonSort('price', 'desc')}
                      className="cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Giá cao đến thấp
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleButtonSort('createdAt', 'desc')}
                      className="cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4 mr-2" />
                      Mới nhất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Active Filters */}
              {(selectedCategory || sortOption.sort) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm  font-medium">Đang lọc:</span>

                  {selectedCategory && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3" />
                      {selectedCategory.name}
                      <button
                        onClick={clearCategoryFilter}
                        className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {sortOption.sort && (
                    <div className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {getSortIcon()}
                      {getSortLabel()}
                      <button
                        onClick={clearSortFilter}
                        className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Results Info */}
            {data?.data && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  Hiển thị {listProduct.length} / {data.data.totalElements} sản
                  phẩm
                </p>
                {data.data.totalPages > 1 && (
                  <p className="text-sm text-gray-500">
                    Trang {pageNumber} / {data.data.totalPages}
                  </p>
                )}
              </div>
            )}

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

            {/* No Products */}
            {listProduct.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi bộ lọc hoặc tìm kiếm khác
                </p>
              </div>
            )}

            {/* Load More */}
            {data?.data && pageNumber < data.data.totalPages && (
              <div className="flex justify-center mt-12">
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLoadmore}
                  disabled={isLoading}
                  className="min-w-[200px]"
                >
                  {isLoading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
