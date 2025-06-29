'use client';

import { addProductToCart } from '@/apis/cart';
import { getProductDetailAPI } from '@/apis/product';
import LoadingOverlay from '@/components/LoadingOverlay';
import Header from '@/components/Header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { stringUtils } from '@/utils/stringUtils';
import { toastSuccess, toastError } from '@/utils/toastify';
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
import { useState } from 'react';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  // TODO: check the image has the position 1
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { data: productDetail, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductDetailAPI(id),
    enabled: stringUtils.isNotNullAndEmpty(id)
  });

  const product = {
    name: 'Premium Wireless Headphones',
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.8,
    reviewCount: 2847,
    description:
      'Experience crystal-clear audio with our flagship wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort design.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'
    ],
    colors: ['Black', 'White', 'Silver', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    features: [
      'Active Noise Cancellation',
      '30-Hour Battery Life',
      'Quick Charge Technology',
      'Premium Materials',
      'Wireless Connectivity',
      'Voice Assistant Compatible'
    ],
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      Impedance: '32 Ohms',
      Weight: '250g',
      Connectivity: 'Bluetooth 5.0, USB-C',
      Battery: '30 hours playback'
    }
  };

  const { mutate: addProductToCartMutation } = useMutation({
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

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  const handleAddToCart = () => {
      addProductToCartMutation({
        productId: id,
        quantity
      });
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <Header />
      <div className="min-h-screen from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square">
              <Image
                src={
                  (productDetail?.data?.images[selectedImage]
                    .src as string) || ''
                }
                alt={
                  (productDetail?.data?.images[selectedImage]
                    .alt as string) || ''
                }
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                width={600}
                height={600}
              />
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

            <Carousel className="w-full">
              <CarouselContent>
                {productDetail?.data?.images.map((image, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-1/3"
                    onClick={() => handleImageClick(index)}
                  >
                    <Image
                      src={image.src || ''}
                      alt={image.alt || ''}
                      className="w-full h-full object-cover rounded-md"
                      width={600}
                      height={600}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Thông tin sản phẩm */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                Hàng mới về
              </Badge>
              <h1 className="text-3xl font-bold mb-2 leading-7 [&:not(:first-child)]:mt-6">
                {productDetail?.data?.title || ''}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium ml-1">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  ({product.reviewCount.toLocaleString()} đánh giá)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price}</span>
              <span className="text-xl text-gray-500 line-through">
                ${product.originalPrice}
              </span>
              <Badge variant="destructive">
                GIẢM {Math.round(
                  ((product.originalPrice - product.price) /
                    product.originalPrice) *
                    100
                )}
                %
              </Badge>
            </div>

            {/* Số lượng và Thêm vào giỏ hàng */}
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Thêm vào giỏ hàng
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tính năng */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tính năng nổi bật</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Thông tin giao hàng */}
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
          </div>
        </div>

        {/* Tab chi tiết sản phẩm */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Mô tả</TabsTrigger>
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Mô tả sản phẩm
                  </h3>
                  <div className="prose max-w-none">
                    <p
                      className="mb-4 prose prose-sm md:prose-base lg:prose-lg prose-blue max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{
                        __html:
                          (productDetail?.data?.description as string) || ''
                      }}
                    ></p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Thông số kỹ thuật
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <span className="font-medium">{key}:</span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Đánh giá của khách hàng
                  </h3>
                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="border-b border-gray-100 pb-6 last:border-b-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {String.fromCharCode(65 + i)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold">
                                Người dùng ẩn danh
                              </span>
                              <div className="flex">
                                {[...Array(5)].map((_, j) => (
                                  <Star
                                    key={j}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600">
                            Chất lượng âm thanh và sự thoải mái tuyệt vời. Chức năng khử tiếng ồn hoạt động hoàn hảo cho việc đi lại hàng ngày của tôi. Rất khuyến khích!
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetailPage;
