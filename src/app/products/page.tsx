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
import { Slider } from '@/components/ui/slider';
import { ErrorMessage } from '@/enums/enums';
import MaintenanceAlert from '@/components/MaintanceAlert';

const HEIGHT_DROP_DOWN = 'h-[300px]';

const ProductsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [pageNumber, setPageNumber] = useState(
    Number(searchParams.get('page')) || Constant.DEFAULT_PAGE_NUMBER
  );
  const category = searchParams.get('category') || '';
  const vendor = searchParams.get('vendor') || '';

  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Price filter state
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 10000000]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);

  const [sortOption, setSortOption] = useState<{
    sort: string;
    direction: string;
    vendor: string;
    category: string;
    minPrice?: number;
    maxPrice?: number;
  }>({
    sort: '',
    direction: '',
    vendor: vendor || '',
    category: category || '',
    minPrice: undefined,
    maxPrice: undefined
  });

  const handleButtonSort = (sort: string, direction: string) => {
    setSortOption((prev) => ({
      ...prev,
      sort,
      direction
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
  };

  // Price filter handlers
  const handlePriceRangeChange = (newRange: number[]) => {
    setTempPriceRange(newRange);
  };

  const applyPriceFilter = () => {
    setPriceRange(tempPriceRange);
    setIsPriceFilterActive(true);
    setSortOption((prev) => ({
      ...prev,
      minPrice: tempPriceRange[0],
      maxPrice: tempPriceRange[1]
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);

    // Update URL params
    params.set('minPrice', tempPriceRange[0].toString());
    params.set('maxPrice', tempPriceRange[1].toString());
    router.push(`/products?${params.toString()}`);
  };

  const clearPriceFilter = () => {
    setPriceRange([0, 10000000]);
    setTempPriceRange([0, 10000000]);
    setIsPriceFilterActive(false);
    setSortOption((prev) => ({
      ...prev,
      minPrice: undefined,
      maxPrice: undefined
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);

    // Remove price params from URL
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`/products?${params.toString()}`);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const { data: listVendor, error: vendorError } = useQuery({
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
    setListProduct([]);
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
    params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

  const clearVendorFilter = () => {
    setSelectedVendor(null);
    setSortOption((prev) => ({
      ...prev,
      vendor: ''
    }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
    params.delete('vendor');
    router.push(`/products?${params.toString()}`);
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

  // Updated query to include price filters
  const {
    data,
    isLoading,
    isSuccess,
    isLoadingError,
    error: listProductError
  } = useQuery({
    queryKey: ['products', pageNumber, sortOption],
    queryFn: () =>
      getProductAPI({
        page: pageNumber,
        size: Constant.DEFAULT_PAGE_SIZE,
        category: sortOption.category,
        vendor: sortOption.vendor,
        sort: sortOption.sort,
        direction: sortOption.direction,
        minPrice: sortOption.minPrice,
        maxPrice: sortOption.maxPrice
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

  const getMinMaxPricesFromProducts = (products: Product[]) => {
    if (!products || products.length === 0) {
      return { minPrice: 0, maxPrice: 10000000 }; // Default values
    }

    const prices = products
      .map((product) => product.price)
      .filter((price) => price != null);

    if (prices.length === 0) {
      return { minPrice: 0, maxPrice: 10000000 }; // Default values if no valid prices
    }

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return { minPrice, maxPrice };
  };

  useEffect(() => {
    if (isSuccess && data?.data?.content) {
      if (pageNumber === 1) {
        setListProduct(data.data.content as unknown as Product[]);
      } else {
        setListProduct((prev) => [
          ...prev,
          ...(data.data.content as unknown as Product[])
        ]);
      }

      if (
        !isPriceFilterActive &&
        (data?.data?.content as unknown as Product[]).length > 0
      ) {
        const { minPrice, maxPrice } = getMinMaxPricesFromProducts(
          data?.data?.content as unknown as Product[]
        );

        // Add some padding to the range for better UX
        const paddedMin = Math.max(0, minPrice - minPrice * 0.1);
        const paddedMax = maxPrice + maxPrice * 0.1;

        setPriceRange([paddedMin, paddedMax]);
        setTempPriceRange([paddedMin, paddedMax]);
      }
    }
  }, [data?.data?.content, isSuccess, pageNumber, vendor, category]);

  // Initialize filters from URL params
  useEffect(() => {
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    if (minPriceParam && maxPriceParam) {
      const minPrice = parseInt(minPriceParam);
      const maxPrice = parseInt(maxPriceParam);
      setPriceRange([minPrice, maxPrice]);
      setTempPriceRange([minPrice, maxPrice]);
      setIsPriceFilterActive(true);
      setSortOption((prev) => ({
        ...prev,
        minPrice,
        maxPrice
      }));
    }
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setPageNumber(page);
    // window.scrollTo({ top: 0, behavior: 'smooth' });
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

  console.log(window.getSelection());

  const generatePaginationNumbers = () => {
    const totalPages = data?.data?.totalPages || 1;
    const current = pageNumber;
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
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

  const { data: categories, error: cateogryError } = useQuery({
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
  const getDynamicPriceRange = () => {
    const { minPrice, maxPrice } = getMinMaxPricesFromProducts(listProduct);

    // Round to nearest thousand for cleaner UI
    const roundedMin = Math.floor(minPrice / 1000) * 1000;
    const roundedMax = Math.ceil(maxPrice / 1000) * 1000;

    return { min: roundedMin, max: roundedMax };
  };

  const renderPriceFilter = () => {
    const dynamicRange = getDynamicPriceRange();

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${isPriceFilterActive ? 'bg-blue-50 border-blue-300 text-blue-700' : ''}`}
          >
            <Tag className="w-4 h-4" />
            {isPriceFilterActive
              ? `${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`
              : 'Khoảng giá'}
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="text-sm font-medium">Chọn khoảng giá</div>
            <div className="text-xs text-muted-foreground mb-2">
              Khoảng: {formatPrice(dynamicRange.min)} -{' '}
              {formatPrice(dynamicRange.max)}
            </div>
            <Slider
              value={tempPriceRange}
              onValueChange={handlePriceRangeChange}
              max={dynamicRange.max}
              min={dynamicRange.min}
              step={Math.max(
                1000,
                Math.floor((dynamicRange.max - dynamicRange.min) / 100)
              )}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(tempPriceRange[0])}</span>
              <span>{formatPrice(tempPriceRange[1])}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={applyPriceFilter} className="flex-1">
                Áp dụng
              </Button>
              {isPriceFilterActive && (
                <Button size="sm" variant="outline" onClick={clearPriceFilter}>
                  Xóa
                </Button>
              )}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const renderCategoryFilter = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            {selectedCategory ? selectedCategory.name : 'Loại sản phẩm'}
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
    );
  };

  const renderSortFilter = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
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
    );
  };

  const renderVendorFilter = () => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
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
    );
  };

  const renderProduct = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {listProduct?.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            handleAddToCart={handleAddProductToCart}
          />
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (data?.data && data.data.totalPages > 1) {
      return (
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
      );
    }
  };

  const isNetworkError = (error: unknown): boolean =>
    error instanceof AxiosError && error.message === ErrorMessage.NETWORK_ERROR;

  if ([vendorError, cateogryError, listProductError].some(isNetworkError)) {
    return <MaintenanceAlert />;
  }

  return (
    <>
      <UnAuthorizedAlert isOpen={isOpenDialog} onClose={handleCloseDialog} />
      <div className="min-h-screen pt-16">
        {isLoading && <LoadingOverlay />}
        {isLoadingError ? (
          <ErrorAlert />
        ) : (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Bộ lọc</span>
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Category Filter */}
                {renderCategoryFilter()}

                {/* Sort Filter */}
                {renderSortFilter()}

                {/* Price Filter */}
                {renderPriceFilter()}

                {/* Vendor Filter */}
                {renderVendorFilter()}
              </div>

              {/* Active Filters */}
              {(selectedCategory ||
                selectedVendor ||
                sortOption.sort ||
                isPriceFilterActive) && (
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
                    <div className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3" />
                      {selectedVendor.name}
                      <button
                        onClick={clearVendorFilter}
                        className="ml-1 hover:bg-purple-200 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {isPriceFilterActive && (
                    <div className="flex items-center gap-1 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                      <Tag className="w-3 h-3" />
                      {formatPrice(priceRange[0])} -{' '}
                      {formatPrice(priceRange[1])}
                      <button
                        onClick={clearPriceFilter}
                        className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
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
            {/* Products Grid */}
            {renderProduct()}
            {/* No Products */}
            {listProduct.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Grid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p>Thử thay đổi bộ lọc hoặc tìm kiếm khác</p>
              </div>
            )}
            {/* Pagination */}
            {renderPagination()}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
