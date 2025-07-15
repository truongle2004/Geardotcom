// Updated ProductsPage.tsx (main component) - Complete version
'use client';
import { addProductToCart } from '@/apis/cart';
import {
  getAllProductCategoryAPI,
  getAllVendor,
  getProductAPI
} from '@/apis/product';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorAlert from '@/components/NoDataAlert';
import UnAuthorizedAlert from '@/components/UnAuthorizedAlert';
import { Constant } from '@/constant/constant';
import { Category, Product, type Vendor } from '@/types';
import { stringUtils } from '@/utils/stringUtils';
import { toastError, toastSuccess, toastWarning } from '@/utils/toastify';
import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import keycloak from '@/config/keycloakConfig';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ErrorMessage } from '@/enums/enums';
import MaintenanceAlert from '@/components/MaintanceAlert';
import FilterContainer from './components/FilterContainer';
import ProductGrid from './components/ProductGrid';
import ProductPagination from './components/ProductPagination';
import EventPosterDialog from '@/components/EventPosterDialog';

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

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDynamicPriceRange = () => {
    const { minPrice, maxPrice } = getMinMaxPricesFromProducts(listProduct);
    const roundedMin = Math.floor(minPrice / 1000) * 1000;
    const roundedMax = Math.ceil(maxPrice / 1000) * 1000;
    return { min: roundedMin, max: roundedMax };
  };

  const getMinMaxPricesFromProducts = (products: Product[]) => {
    if (!products || products.length === 0) {
      return { minPrice: 0, maxPrice: 10000000 };
    }
    const prices = products
      .map((product) => product.price)
      .filter((price) => price != null);
    if (prices.length === 0) {
      return { minPrice: 0, maxPrice: 10000000 };
    }
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    return { minPrice, maxPrice };
  };

  // Handler functions
  const handleButtonSort = (sort: string, direction: string) => {
    setSortOption((prev) => ({ ...prev, sort, direction }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
  };

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
    params.delete('minPrice');
    params.delete('maxPrice');
    router.push(`/products?${params.toString()}`);
  };

  const onSelectedCategory = (categoryItem: Category) => {
    setSelectedCategory(categoryItem);
    const sort = { ...sortOption, category: categoryItem.handle };
    setSortOption(sort);
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
    params.set('category', categoryItem.handle);
    router.push(`/products?${params.toString()}`);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory(null);
    setSortOption((prev) => ({ ...prev, category: category || '' }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
    params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

  const onSelectedVendor = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    const sort = { ...sortOption, vendor: vendor.handle };
    setSortOption(sort);
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
    params.set('vendor', vendor.handle);
    router.push(`/products?${params.toString()}`);
  };

  const clearVendorFilter = () => {
    setSelectedVendor(null);
    setSortOption((prev) => ({ ...prev, vendor: '' }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
    params.delete('vendor');
    router.push(`/products?${params.toString()}`);
  };

  const clearSortFilter = () => {
    setSortOption((prev) => ({ ...prev, sort: '', direction: '' }));
    setPageNumber(Constant.DEFAULT_PAGE_NUMBER);
    setListProduct([]);
  };

  const handlePageChange = (page: number) => {
    setPageNumber(page);
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

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  // Queries
  const { data: listVendor, error: vendorError } = useQuery({
    queryKey: ['vendors'],
    queryFn: () => getAllVendor()
  });

  const { data: categories, error: categoryError } = useQuery({
    queryKey: ['categories'],
    queryFn: getAllProductCategoryAPI
  });

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

  // Effects
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

        const paddedMin = Math.max(0, minPrice - minPrice * 0.1);
        const paddedMax = maxPrice + maxPrice * 0.1;

        setPriceRange([paddedMin, paddedMax]);
        setTempPriceRange([paddedMin, paddedMax]);
      }
    }
  }, [data?.data?.content, isSuccess, pageNumber, vendor, category]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, vendor]);

  // Error handling
  const isNetworkError = (error: unknown): boolean =>
    error instanceof AxiosError && error.message === ErrorMessage.NETWORK_ERROR;

  if ([vendorError, categoryError, listProductError].some(isNetworkError)) {
    return <MaintenanceAlert />;
  }

  return (
    <>
      <EventPosterDialog
        posterUrl="https://file.hstatic.net/200000722513/file/hssv_popup_838cebd1e40c4080a064c83efca94d1c_grande.jpg"
        alt="test"
      />
      <UnAuthorizedAlert isOpen={isOpenDialog} onClose={handleCloseDialog} />
      <div className="min-h-screen pt-16">
        {isLoading && <LoadingOverlay />}
        {isLoadingError ? (
          <ErrorAlert />
        ) : (
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <FilterContainer
              categories={categories?.data || []}
              vendors={listVendor?.data || []}
              selectedCategory={selectedCategory}
              selectedVendor={selectedVendor}
              sortOption={sortOption}
              priceRange={priceRange}
              tempPriceRange={tempPriceRange}
              isPriceFilterActive={isPriceFilterActive}
              dynamicRange={getDynamicPriceRange()}
              formatPrice={formatPrice}
              heightDropDown={HEIGHT_DROP_DOWN}
              onSelectedCategory={onSelectedCategory}
              onSelectedVendor={onSelectedVendor}
              onSort={handleButtonSort}
              onPriceRangeChange={handlePriceRangeChange}
              onApplyPriceFilter={applyPriceFilter}
              onClearPriceFilter={clearPriceFilter}
              onClearCategory={clearCategoryFilter}
              onClearVendor={clearVendorFilter}
              onClearSort={clearSortFilter}
            />

            {/* Products Grid */}
            <ProductGrid products={listProduct} isLoading={isLoading} />

            {/* Pagination */}
            <ProductPagination
              currentPage={pageNumber}
              totalPages={data?.data?.totalPages || 1}
              onPageChange={handlePageChange}
              onPreviousPage={handlePreviousPage}
              onNextPage={handleNextPage}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
