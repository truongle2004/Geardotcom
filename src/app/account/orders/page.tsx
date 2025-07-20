'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Star,
  Truck,
  Tag,
  Check,
  X,
  Wallet,
  Shield,
  AlertCircle
} from 'lucide-react';

// TypeScript interfaces
interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

interface Coupon {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  description: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
}

// Mock data
const mockOrder: Order = {
  id: '1',
  orderNumber: 'ORD-2024-001234',
  items: [
    {
      id: '1',
      name: 'Wireless Bluetooth Headphones',
      description:
        'Premium noise-cancelling over-ear headphones with 30-hour battery life',
      price: 299.99,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
      category: 'Electronics',
      rating: 4.8,
      reviews: 1247
    },
    {
      id: '2',
      name: 'Smart Fitness Tracker',
      description:
        'Advanced fitness tracker with heart rate monitoring and GPS',
      price: 199.99,
      quantity: 2,
      image:
        'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop',
      category: 'Wearables',
      rating: 4.6,
      reviews: 892
    },
    {
      id: '3',
      name: 'USB-C Fast Charger',
      description: '65W fast charging adapter with multiple ports',
      price: 49.99,
      quantity: 1,
      image:
        'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
      category: 'Accessories',
      rating: 4.4,
      reviews: 456
    }
  ],
  subtotal: 749.97,
  shipping: 15.99,
  tax: 67.5,
  discount: 0,
  total: 833.46,
  shippingAddress: {
    name: 'Nguyễn Văn A',
    street: '123 Nguyễn Huệ, Quận 1',
    city: 'Hồ Chí Minh',
    state: 'TP.HCM',
    zipCode: '70000',
    country: 'Vietnam',
    phone: '+84 901 234 567'
  }
};

const availableCoupons: Coupon[] = [
  {
    code: 'SAVE10',
    discount: 10,
    type: 'percentage',
    description: 'Giảm 10% cho đơn hàng'
  },
  {
    code: 'NEWUSER50',
    discount: 50000,
    type: 'fixed',
    description: 'Giảm 50,000₫ cho khách hàng mới'
  },
  {
    code: 'FREESHIP',
    discount: 15.99,
    type: 'fixed',
    description: 'Miễn phí vận chuyển'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount * 23000); // Mock conversion rate
};

export default function OrderProcessingPage() {
  const [order, setOrder] = useState<Order>(mockOrder);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApplyCoupon = () => {
    setCouponError('');
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );

    if (!coupon) {
      setCouponError('Mã giảm giá không hợp lệ');
      return;
    }

    if (appliedCoupon) {
      setCouponError('Bạn đã áp dụng mã giảm giá rồi');
      return;
    }

    setAppliedCoupon(coupon);

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (order.subtotal * coupon.discount) / 100;
    } else {
      discount = coupon.discount;
    }

    setOrder((prev) => ({
      ...prev,
      discount: discount,
      total: prev.subtotal + prev.shipping + prev.tax - discount
    }));

    setCouponCode('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setOrder((prev) => ({
      ...prev,
      discount: 0,
      total: prev.subtotal + prev.shipping + prev.tax
    }));
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Redirect to VNPay or show success message
      alert('Đang chuyển hướng đến VNPay để thanh toán...');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại giỏ hàng
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Xác nhận đơn hàng</h1>
              <p className="mt-1 text-gray-600">
                Vui lòng kiểm tra thông tin và hoàn tất thanh toán
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  Thanh toán an toàn
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Sản phẩm đã chọn ({order.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {item.rating} ({item.reviews} đánh giá)
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-medium">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity}
                        </p>
                        <p className="text-lg font-medium mt-1 text-blue-600">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && (
                      <Separator className="mt-4" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Thông tin giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {order.shippingAddress.name}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.street}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">
                      {order.shippingAddress.phone}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2">
                    Thay đổi địa chỉ
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'vnpay'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('vnpay')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">VNPay</p>
                          <p className="text-sm text-gray-600">
                            Thanh toán qua VNPay
                          </p>
                        </div>
                      </div>
                      {paymentMethod === 'vnpay' && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'momo'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('momo')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">M</span>
                        </div>
                        <div>
                          <p className="font-medium">MoMo</p>
                          <p className="text-sm text-gray-600">
                            Ví điện tử MoMo
                          </p>
                        </div>
                      </div>
                      {paymentMethod === 'momo' && (
                        <Check className="w-5 h-5 text-pink-600" />
                      )}
                    </div>
                  </div>

                  <div
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setPaymentMethod('bank')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">Chuyển khoản ngân hàng</p>
                          <p className="text-sm text-gray-600">
                            Thanh toán qua ngân hàng
                          </p>
                        </div>
                      </div>
                      {paymentMethod === 'bank' && (
                        <Check className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Coupon */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Mã giảm giá
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="coupon">Nhập mã giảm giá</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          id="coupon"
                          placeholder="Nhập mã..."
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={!couponCode}
                        >
                          Áp dụng
                        </Button>
                      </div>
                    </div>
                    {couponError && (
                      <div className="flex items-center space-x-2 text-red-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{couponError}</span>
                      </div>
                    )}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Mã có sẵn:</p>
                      {availableCoupons.map((coupon) => (
                        <div
                          key={coupon.code}
                          className="text-xs bg-gray-50 p-2 rounded"
                        >
                          <span className="font-medium">{coupon.code}</span> -{' '}
                          {coupon.description}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium text-green-800">
                          {appliedCoupon.code}
                        </p>
                        <p className="text-sm text-green-600">
                          {appliedCoupon.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveCoupon}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế</span>
                  <span>{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Process Payment */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  className="w-full py-6 text-lg font-medium"
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5 mr-2" />
                      Thanh toán {formatCurrency(order.total)}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Bằng cách đặt hàng, bạn đồng ý với Điều khoản sử dụng của
                  chúng tôi
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
