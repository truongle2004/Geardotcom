'use client';

import { addProductToCart } from '@/apis/cart';
import { getProductDetailAPI } from '@/apis/product';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import UnAuthorizedAlert from '@/components/UnAuthorizedAlert';
import keycloak from '@/config/keycloakConfig';
import { stringUtils } from '@/utils/stringUtils';
import { toastError, toastSuccess, toastWarning } from '@/utils/toastify';
import { convertVND } from '@/utils/vnd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  Heart,
  Minus,
  Plus,
  RotateCcw,
  Share2,
  Shield,
  ShoppingCart,
  Star,
  Truck
} from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Loading skeleton components
const ImageSkeleton = () => (
  <div className="relative overflow-hidden rounded-2xl bg-gray-200 aspect-square animate-pulse">
    <div className="w-full h-full bg-gray-300"></div>
  </div>
);

const ThumbnailSkeleton = () => (
  <div className="flex gap-2">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="w-20 h-20 bg-gray-200 rounded-md animate-pulse"
      ></div>
    ))}
  </div>
);

const ProductInfoSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
      <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
    <div className="space-y-2">
      <div className="h-10 bg-gray-200 rounded animate-pulse w-1/3"></div>
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
    </div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
      <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isOpenDialog, setIsOpenDialog] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetailAPI(id),
    enabled: stringUtils.isNotNullAndEmpty(id)
  });

  const { mutate: addProductToCartMutation, isPending: isAddingToCart } =
    useMutation({
      mutationFn: (data: { productId: string; quantity: number }) =>
        addProductToCart(data.productId, data.quantity),
      onSuccess: (response) => {
        if (response.httpStatus === 409) {
          toastWarning(response.data);
          return;
        }
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

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleOpenDialog = () => {
    setIsOpenDialog(true);
  };

  const handleAddToCart = () => {
    if (!keycloak.authenticated) {
      handleOpenDialog();
      return;
    }

    addProductToCartMutation({
      productId: id,
      quantity
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
  };

  // Extract product data from API response
  const productDetail = data?.data;
  const productImages = productDetail?.images || [];
  const productTitle = productDetail?.title || '';
  const productPrice = productDetail?.price || 0;
  const productDescription = productDetail?.description || '';

  // Mock data for features that might not come from API
  const mockRating = 4.8;
  const mockReviewCount = 2847;
  const mockOriginalPrice = productPrice * 1.3; // 30% markup for discount display
  const mockFeatures = [
    'Chất lượng cao',
    'Bảo hành chính hãng',
    'Giao hàng nhanh',
    'Hỗ trợ 24/7',
    'Đổi trả dễ dàng',
    'Giá cả hợp lý'
  ];

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().length > 0) {
        console.log('User selected text:', selection.toString());
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  return (
    <>
      <UnAuthorizedAlert isOpen={isOpenDialog} onClose={handleCloseDialog} />
      {isLoading && <LoadingOverlay />}
      <div className="min-h-screen from-slate-50 to-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {isLoading ? (
                <>
                  <ImageSkeleton />
                  <ThumbnailSkeleton />
                </>
              ) : (
                <>
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
                    {productImages.length > 0 ? (
                      <Image
                        src={productImages[selectedImage]?.src || ''}
                        alt={productImages[selectedImage]?.alt || productTitle}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        width={600}
                        height={600}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-gray-400">Không có hình ảnh</span>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm hover:bg-white"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                      <Heart
                        className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
                      />
                    </Button>
                  </div>

                  {productImages.length > 1 && (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {productImages.map((image, index) => (
                          <CarouselItem
                            key={index}
                            className="basis-1/4 cursor-pointer"
                            onClick={() => handleImageClick(index)}
                          >
                            <div
                              className={`relative overflow-hidden rounded-md ${selectedImage === index ? 'ring-2 ring-blue-500' : ''}`}
                            >
                              <Image
                                src={image.src || ''}
                                alt={image.alt || productTitle}
                                className="w-full h-full object-cover aspect-square"
                                width={150}
                                height={150}
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  )}
                </>
              )}
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              {isLoading ? (
                <ProductInfoSkeleton />
              ) : (
                <>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Hàng mới về
                    </Badge>
                    <h1 className="text-3xl font-bold mb-2 leading-7 [&:not(:first-child)]:mt-6">
                      {productTitle || 'Tên sản phẩm'}
                    </h1>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(mockRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="text-sm font-medium ml-1">
                          {mockRating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({mockReviewCount.toLocaleString()} đánh giá)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold">
                      {convertVND(productPrice)}
                    </span>
                    {mockOriginalPrice > productPrice && (
                      <>
                        <span className="text-xl text-gray-500 line-through">
                          {convertVND(mockOriginalPrice)}
                        </span>
                        <Badge variant="destructive">
                          GIẢM{' '}
                          {Math.round(
                            ((mockOriginalPrice - productPrice) /
                              mockOriginalPrice) *
                              100
                          )}
                          %
                        </Badge>
                      </>
                    )}
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-3">Số lượng</h3>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-medium text-lg w-8 text-center">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleQuantityChange(1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        size="lg"
                      >
                        {isAddingToCart ? (
                          <>
                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Đang thêm...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Thêm vào giỏ hàng
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="lg">
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Features */}
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Tính năng nổi bật</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {mockFeatures.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Info */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span>Miễn phí vận chuyển</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span>Bảo hành 2 năm</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RotateCcw className="h-4 w-4 text-purple-600" />
                      <span>Đổi trả trong 30 ngày</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-16">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
                  <div className="prose max-w-none">
                    {productDescription ? (
                      <div
                        className="mb-4 prose prose-sm md:prose-base lg:prose-lg prose-blue max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{
                          __html: productDescription
                        }}
                      />
                    ) : (
                      <p className="text-gray-500">Chưa có mô tả sản phẩm</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
