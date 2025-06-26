'use client';
import { addProductToCart } from '@/apis/cart';
import {
  getAllProductCategoryAPI,
  getAllVendor,
  getProductAPI
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import UnAuthorizedAlert from '@/components/UnAuthorizedAlert';
import { Constant } from '@/constant/constant';
import { Category, Product, type Vendor } from '@/types';
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
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const HEIGHT_DROP_DOWN = 'h-[300px]';

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [pageNumber, setPageNumber] = useState(Constant.DEFAULT_PAGE_NUMBER);
  const [paginationMode, setPaginationMode] = useState<
    'loadmore' | 'pagination'
  >('pagination'); // Toggle between modes
  const category = searchParams.get('category') || '';
  const vendor = searchParams.get('vendor') || '';
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const [sortOption, setSortOption] = useState<{
    sort: string;
    direction: string;
    vendor: string;
    category: string;
  }>({
    sort: '',
    direction: '',
    vendor: vendor || '',
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

  const { data: listVendor } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getAllVendor()
  });

  const onSelectedCategory = (categoryItem: Category) => {
    setSelectedCategory(categoryItem);
    const sort = {
      ...sortOption,
      category: categoryItem.handle
    };
    setSortOption(sort);
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]); // Reset products when category changes
    params.set('category', categoryItem.handle);
    router.push(`/products?${params.toString()}`);
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
      getProductAPI({
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
      if (paginationMode === 'loadmore') {
        // Load more mode: append new products
        if (pageNumber === 1) {
          setListProduct(data.data.content as unknown as Product[]);
        } else {
          setListProduct((prev) => [
            ...prev,
            ...(data.data.content as unknown as Product[])
          ]);
        }
      } else {
        // Pagination mode: replace products
        setListProduct(data.data.content as unknown as Product[]);
      }
    }
  }, [
    data?.data?.content,
    isSuccess,
    pageNumber,
    paginationMode,
    vendor,
    category
  ]);

  const handleLoadmore = () => {
    if (
      data?.data?.totalPages !== undefined &&
      pageNumber < data?.data?.totalPages
    ) {
      setPageNumber(pageNumber + 1);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      handlePageChange(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (data?.data?.totalPages && pageNumber < data.data.totalPages) {
      handlePageChange(pageNumber + 1);
    }
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const totalPages = data?.data?.totalPages || 1;
    const current = pageNumber;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(
          1,
          '...',
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          '...',
          current - 1,
          current,
          current + 1,
          '...',
          totalPages
        );
      }
    }

    return pages;
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
  }, [category, vendor]);

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

  const onSeletedVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    const sort = {
      ...sortOption,
      vendor: vendor.handle
    };
    setSortOption(sort);
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
    params.set('vendor', vendor.handle);
    router.push(`/products?${params.toString()}`);
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
                  <DropdownMenuContent className={`w-56 ${HEIGHT_DROP_DOWN}`}>
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

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Tag className="w-4 h-4" />
                      {selectedVendor ? selectedVendor.name : 'Nhà cung cấp'}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className={`w-56 ${HEIGHT_DROP_DOWN}`}>
                    {listVendor?.data.map((vendor) => (
                      <DropdownMenuItem
                        key={vendor.id}
                        onClick={() => onSeletedVendor(vendor)}
                        className="cursor-pointer"
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        {vendor.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Pagination Mode Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newMode =
                      paginationMode === 'pagination'
                        ? 'loadmore'
                        : 'pagination';
                    setPaginationMode(newMode);
                    setPageNumber(1);
                    setListProduct([]);
                  }}
                >
                  {paginationMode === 'pagination'
                    ? 'Chế độ tải thêm'
                    : 'Chế độ phân trang'}
                </Button>
              </div>

              {/* Active Filters */}
              {(selectedCategory || selectedVendor || sortOption.sort) && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm font-medium">Đang lọc:</span>

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

                  {selectedVendor && (
                    <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3" />
                      {selectedVendor.name}
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
                  {paginationMode === 'pagination'
                    ? `Hiển thị ${(pageNumber - 1) * Constant.DEFAULT_PAGE_SIZE + 1}-${Math.min(pageNumber * Constant.DEFAULT_PAGE_SIZE, data.data.totalElements)} / ${data.data.totalElements} sản phẩm`
                    : `Hiển thị ${listProduct.length} / ${data.data.totalElements} sản phẩm`}
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
              {listProduct?.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                  handleAddToCart={handleAddProductToCart}
                />
              ))}
            </div>

            {/* No Products */}
            {listProduct.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium  mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </div>
            )}

            {/* Load More Button (only in loadmore mode) */}
            {paginationMode === 'loadmore' &&
              data?.data &&
              pageNumber < data.data.totalPages && (
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

            {/* Pagination (only in pagination mode) */}
            {paginationMode === 'pagination' &&
              data?.data &&
              data.data.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={handlePreviousPage}
                          className={
                            pageNumber === 1
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>

                      {generatePaginationNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === '...' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page as number)}
                              isActive={page === pageNumber}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          onClick={handleNextPage}
                          className={
                            pageNumber === data?.data?.totalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
