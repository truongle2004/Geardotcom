'use client';

import React from 'react';
import {
  Package,
  Truck,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Check,
  Star,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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

interface PaymentInfo {
  method: string;
  last4: string;
  expiryDate: string;
  cardType: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  estimatedDelivery: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  trackingNumber?: string;
}

// Mock data
const mockOrder: Order = {
  id: '1',
  orderNumber: 'ORD-2024-001234',
  status: 'shipped',
  orderDate: '2024-06-15T10:30:00Z',
  estimatedDelivery: '2024-06-20T18:00:00Z',
  trackingNumber: 'TRK123456789',
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
  discount: 75.0,
  total: 758.46,
  shippingAddress: {
    name: 'John Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567'
  },
  billingAddress: {
    name: 'John Doe',
    street: '123 Main Street, Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    phone: '+1 (555) 123-4567'
  },
  paymentInfo: {
    method: 'Credit Card',
    last4: '4242',
    expiryDate: '12/25',
    cardType: 'Visa'
  }
};

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'shipped':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export default function OrderPage() {
  const order = mockOrder;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="mt-1">Order #{order.orderNumber}</p>
            </div>
            <Badge
              className={`mt-2 sm:mt-0 w-fit ${getStatusColor(order.status)}`}
            >
              <Check className="w-3 h-3 mr-1" />
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
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
                  Order Items ({order.items.length})
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
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm mt-1">{item.description}</p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">
                              {item.rating} ({item.reviews} reviews)
                            </span>
                          </div>
                          <Badge variant="secondary" className="ml-2">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-sm font-medium">
                          {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium mt-1">
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

            {/* Shipping Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Shipping Address</h4>
                    <div className="space-y-2 text-sm ">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium ">
                            {order.shippingAddress.name}
                          </p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{' '}
                            {order.shippingAddress.state}{' '}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{order.shippingAddress.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Delivery Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <div>
                          <span>Estimated Delivery:</span>
                          <p className="font-medium">
                            {formatDate(order.estimatedDelivery)}
                          </p>
                        </div>
                      </div>
                      {order.trackingNumber && (
                        <div className="mt-3">
                          <span>Tracking Number:</span>
                          <p className="font-mono text-sm font-medium text-blue-600">
                            {order.trackingNumber}
                          </p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Track Package
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Payment Method</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {order.paymentInfo.cardType} ••••{' '}
                          {order.paymentInfo.last4}
                        </p>
                        <p className="text-sm">
                          Expires {order.paymentInfo.expiryDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">
                      Billing Address
                    </h4>
                    <div className="text-sm">
                      <p className="font-medium">
                        {order.billingAddress.name}
                      </p>
                      <p>{order.billingAddress.street}</p>
                      <p>
                        {order.billingAddress.city},{' '}
                        {order.billingAddress.state}{' '}
                        {order.billingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">
                    -{formatCurrency(order.discount)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm">
                        {formatDate(order.orderDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Processing</p>
                      <p className="text-sm">
                        June 15, 2024 at 2:15 PM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Truck className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm">
                        June 16, 2024 at 9:30 AM
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4" />
                    </div>
                    <div>
                      <p>Delivered</p>
                      <p className="text-sm">
                        Estimated: June 20, 2024
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="outline" className="w-full">
                Download Invoice
              </Button>
              <Button variant="outline" className="w-full">
                Return Items
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
