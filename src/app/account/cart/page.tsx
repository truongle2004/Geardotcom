'use client';

import { deleteCartItem, getUserCartAPI } from '@/apis/cart';
import { addProductToWishlist } from '@/apis/wishlist';
import CartItem from '@/components/CartItem';
import LoadingOverlay from '@/components/LoadingOverlay';
import MaintenanceAlert from '@/components/MaintanceAlert';
import NoDataAlert from '@/components/NoDataAlert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import UnAuthorizedAlert from '@/components/UnAuthorizedAlert';
import { Constant } from '@/constant/constant';
import { ErrorMessage, RouteEnum } from '@/enums/enums';
import useUserStore from '@/store/userStore';
import { toastError, toastSuccess } from '@/utils/toastify';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  ArrowRight,
  CreditCard,
  Gift,
  Loader2,
  Package,
  ShoppingCart,
  Tag,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const Cart = () => {
  const [voucherCode, setVoucherCode] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [priceFilter, setPriceFilter] = useState('all');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isOpenUnauthorizedAlert, setIsOpenUnauthorizedAlert] = useState(false);

  const { userInfo } = useUserStore();

  const handleCloseUnauthorizedAlert = () => {
    setIsOpenUnauthorizedAlert(false);
  };

  const handleOpenUnauthorizedAlert = () => {
    setIsOpenUnauthorizedAlert(true);
  };

  const {
    data,
    isLoading,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useInfiniteQuery({
    queryKey: ['user-cart', searchTerm, sortBy, sortOrder, priceFilter],
    queryFn: ({ pageParam = Constant.DEFAULT_PAGE_NUMBER }) =>
      getUserCartAPI(pageParam, 20),
    initialPageParam: Constant.DEFAULT_PAGE_NUMBER,
    getNextPageParam: (lastPage, allPages) => {
      return !lastPage?.data?.last ? allPages.length + 1 : undefined;
    },
    enabled:
      userInfo.sub !== undefined &&
      userInfo.sub !== null &&
      userInfo.sub !== '',
    retry: false
  });

  const cartItemsData = useMemo(() => {
    return data?.pages?.flatMap((page) => page?.data.content) || [];
  }, [data]);

  const allItemsSelected =
    cartItemsData!.length > 0 && selectedItems.size === cartItemsData!.length;
  const someItemsSelected =
    selectedItems.size > 0 && selectedItems.size < cartItemsData!.length;

  const { mutate: deleteCartItemMutation, isPending: isDeletingPending } =
    useMutation({
      mutationKey: ['deleteCartItem'],
      mutationFn: deleteCartItem,
      onSuccess: (response) => {
        if (response.data) toastSuccess(response.data);
        refetch();
      },
      onError: (err) => {
        console.log(err);
      }
    });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px'
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  const handleSelectAll = () => {
    if (allItemsSelected) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItemsData!.map((item) => item.id)));
    }
  };

  const handleDeleteCartItem = (id: string) => {
    deleteCartItemMutation([id]);
  };

  const handleDeleteCartSelected = () => {
    deleteCartItemMutation(Array.from(selectedItems));
  };

  const handleSelectedCart = (id: string, isChecked: boolean) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (isChecked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const selectedItemsTotal = useMemo(() => {
    return cartItemsData!
      .filter((item) => selectedItems.has(item?.id))
      .reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItemsData, selectedItems]);

  const selectedItemsCount = selectedItems.size;

  useEffect(() => {
    if (error && error instanceof AxiosError) {
      handleOpenUnauthorizedAlert();
    }
  }, [error]);

  const { mutate: addProductToWishlistMutation } = useMutation({
    mutationKey: ['addProductToWishlist'],
    mutationFn: addProductToWishlist,
    onSuccess: (response) => {
      if (response.data) toastSuccess(response.data);
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        toastError(err.response?.data);
      }
    }
  });

  const handleAddProductToWishlist = (productId: string) => {
    addProductToWishlistMutation(productId);
  };

  if (
    error &&
    error instanceof AxiosError &&
    error.message === ErrorMessage.NETWORK_ERROR.toString()
  ) {
    return <MaintenanceAlert />;
  }

  return (
    <>
      <UnAuthorizedAlert
        onClose={handleCloseUnauthorizedAlert}
        isOpen={isOpenUnauthorizedAlert}
      />
      {(isLoading || isDeletingPending) && <LoadingOverlay />}
      {isError &&
      cartItemsData.length === 0 &&
      error.message !== ErrorMessage.NETWORK_ERROR.toString() ? (
        <NoDataAlert />
      ) : (
        <section className="py-8 md:py-16 antialiased min-h-screen">
          <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                  Giỏ Hàng
                </h2>
                {cartItemsData!.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {cartItemsData!.length} sản phẩm
                  </Badge>
                )}
              </div>

              {/* Search and Filter Bar */}
              {/* <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="name">Tên</SelectItem>
                          <SelectItem value="price">Giá</SelectItem>
                          <SelectItem value="quantity">Số lượng</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleSortOrder}
                        className="shrink-0"
                      >
                        {sortOrder === 'asc' ? (
                          <SortAsc className="h-4 w-4" />
                        ) : (
                          <SortDesc className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="shrink-0"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </div>

                  {showFilters && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Khoảng giá
                          </label>
                          <Select
                            value={priceFilter}
                            onValueChange={setPriceFilter}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tất cả giá</SelectItem>
                              <SelectItem value="0-25">
                                0đ - 625.000đ
                              </SelectItem>
                              <SelectItem value="25-50">
                                625.000đ - 1.250.000đ
                              </SelectItem>
                              <SelectItem value="50-100">
                                1.250.000đ - 2.500.000đ
                              </SelectItem>
                              <SelectItem value="100">2.500.000đ+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card> */}
            </div>

            {/* Selection Controls */}
            {cartItemsData!.length > 0 && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        onClick={handleSelectAll}
                        checked={allItemsSelected}
                        className={
                          someItemsSelected && !allItemsSelected
                            ? 'data-[state=checked]:bg-primary/50'
                            : ''
                        }
                      />
                      <span className="text-sm font-medium">
                        Chọn tất cả ({cartItemsData!.length} sản phẩm)
                      </span>
                    </div>

                    {selectedItemsCount > 0 && (
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {selectedItemsCount} đã chọn •{' '}
                          {selectedItemsTotal.toLocaleString('vi-VN')}đ
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleDeleteCartSelected}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa đã chọn
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="md:gap-6 lg:flex lg:items-start xl:gap-8">
              {/* Cart Items */}
              <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
                {cartItemsData!.length === 0 && !isLoading ? (
                  <Card className="text-center py-12">
                    <CardContent>
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Giỏ hàng của bạn đang trống
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Thêm sản phẩm để bắt đầu mua sắm
                      </p>
                      <Link href={RouteEnum.PRODUCTS}>
                        <Button>
                          Tiếp tục mua sắm
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {cartItemsData!.map((item) => (
                      <CartItem
                        key={item?.id}
                        cartItem={item}
                        isPendingDelete={isDeletingPending}
                        isSelected={selectedItems.has(item?.id)}
                        handleSelectCart={handleSelectedCart}
                        handleDeleteItem={handleDeleteCartItem}
                        handleAddProductToWishlist={handleAddProductToWishlist}
                      />
                    ))}

                    {/* Infinite scroll trigger */}
                    <div ref={loadMoreRef} className="flex justify-center py-4">
                      {isFetchingNextPage && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Đang tải thêm sản phẩm...</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CreditCard className="h-5 w-5" />
                      Tóm tắt đơn hàng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Sản phẩm ({selectedItemsCount})
                        </span>
                        <span className="font-medium">
                          {selectedItemsTotal.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Phí vận chuyển
                        </span>
                        <span className="font-medium text-green-600">
                          Miễn phí
                        </span>
                      </div>
                      {/* <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Thuế</span>
                        <span className="font-medium">
                          {(selectedItemsTotal * 0.08).toLocaleString('vi-VN')}đ
                        </span>
                      </div> */}
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">Tổng cộng</span>
                      <span className="text-lg font-bold">
                        {(selectedItemsTotal * 1.08).toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      disabled={selectedItemsCount === 0}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Tiến hành thanh toán ({selectedItemsCount})
                    </Button>

                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500">hoặc</span>
                      <Button variant="link" className="p-0 h-auto">
                        Tiếp tục mua sắm
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Voucher Card */}
                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift className="h-5 w-5 text-primary" />
                        <label
                          htmlFor="voucher"
                          className="text-sm font-medium"
                        >
                          Mã khuyến mãi hoặc thẻ quà tặng
                        </label>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          id="voucher"
                          value={voucherCode}
                          onChange={(e) => setVoucherCode(e.target.value)}
                          placeholder="Nhập mã"
                          className="flex-1"
                        />
                        <Button variant="outline">
                          <Tag className="h-4 w-4 mr-2" />
                          Áp dụng
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;
