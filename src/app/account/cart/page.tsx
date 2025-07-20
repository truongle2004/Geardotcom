'use client';

import { createOrderAPI, deleteCartItem, getUserCartAPI } from '@/apis/cart';
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
  const [selectedItems, setSelectedItems] = useState<
    Map<string, { quantity: number; productId: string }>
  >(new Map());

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
    isLoading: isLoadingCartItems,
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

  const { mutate: deleteCartItemMutation, isPending: isPendingDeleteCartItem } =
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

  const { mutate: createOrderMutation, isPending: isPendingCreateOrder } =
    useMutation({
      mutationKey: ['createOrder', selectedItems],
      mutationFn: createOrderAPI,
      onSuccess: (response) => {
        if (response.httpStatus >= 400) {
          toastError(response.data as unknown as string);
          return;
        } else {
          window.location.href = response.data.url;
        }
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
      setSelectedItems(new Map());
    } else {
      const newMap = new Map<string, { quantity: number; productId: string }>();
      cartItemsData.forEach((item) => {
        newMap.set(item.id, {
          quantity: item.quantity,
          productId: item.productId
        });
      });
      setSelectedItems(newMap);
    }
  };
  const handleDeleteCartItem = (id: string) => {
    deleteCartItemMutation([id]);
  };

  const handleDeleteCartSelected = () => {
    deleteCartItemMutation(Array.from(selectedItems.keys()));
  };

  const handleSelectedCart = (
    id: string,
    isChecked: boolean,
    quantity: number
  ) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (isChecked) {
        const cartItem = cartItemsData.find((item) => item.id === id);
        if (cartItem) {
          newMap.set(id, { quantity, productId: cartItem.productId });
        }
      } else {
        newMap.delete(id);
      }
      return newMap;
    });
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setSelectedItems((prev) => {
      const newMap = new Map(prev);
      if (newMap.has(id)) {
        const existing = newMap.get(id)!;
        newMap.set(id, { ...existing, quantity: newQuantity });
      }
      return newMap;
    });
  };

  const selectedItemsTotal = useMemo(() => {
    return cartItemsData
      .filter((item) => selectedItems.has(item.id))
      .reduce((total, item) => {
        const selectedItem = selectedItems.get(item.id);
        const selectedQuantity = selectedItem?.quantity || item.quantity;
        return total + item.price * selectedQuantity;
      }, 0);
  }, [cartItemsData, selectedItems]);
  const selectedItemsCount = selectedItems.size;

  const handleCreateOrder = () => {
    const selectedItemsArray = Array.from(selectedItems.values()).map(
      ({ productId, quantity }) => ({
        productId,
        quantity
      })
    );
    createOrderMutation(selectedItemsArray);
  };

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
      {(isLoadingCartItems ||
        isPendingDeleteCartItem ||
        isPendingCreateOrder) && <LoadingOverlay />}
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
                {cartItemsData!.length === 0 && !isLoadingCartItems ? (
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
                        isPendingDelete={isPendingDeleteCartItem}
                        isSelected={selectedItems.has(item?.id)}
                        selectedQuantity={
                          selectedItems.get(item?.id ?? '') ??
                          item?.quantity ??
                          1
                        }
                        handleSelectCart={handleSelectedCart}
                        handleDeleteItem={handleDeleteCartItem}
                        handleAddProductToWishlist={handleAddProductToWishlist}
                        handleQuantityChange={handleQuantityChange}
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
                      onClick={handleCreateOrder}
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
