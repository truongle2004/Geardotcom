'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bell,
  CheckCircle,
  Clock,
  CreditCard,
  Edit,
  Gift,
  Heart,
  MapPin,
  Package,
  Settings,
  Shield,
  ShoppingBag,
  Star,
  Truck,
  User,
  XCircle
} from 'lucide-react';
import { useState } from 'react';

// Mock data for e-commerce user profile
const mockUserData = {
  id: 'customer-789',
  firstName: 'Emma',
  lastName: 'Davis',
  email: 'emma.davis@email.com',
  phone: '+1 (555) 987-6543',
  avatar:
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  memberSince: '2022-08-15',
  membershipTier: 'Gold',

  // Account Stats
  stats: {
    totalOrders: 47,
    totalSpent: 2847.5,
    wishlistItems: 12,
    loyaltyPoints: 1250
  },

  // Addresses
  addresses: [
    {
      id: 1,
      type: 'Home',
      isDefault: true,
      street: '123 Oak Street',
      city: 'Portland',
      state: 'OR',
      zipCode: '97201',
      country: 'USA'
    },
    {
      id: 2,
      type: 'Work',
      isDefault: false,
      street: '456 Business Ave, Suite 200',
      city: 'Portland',
      state: 'OR',
      zipCode: '97205',
      country: 'USA'
    }
  ],

  // Recent Orders
  recentOrders: [
    {
      id: 'ORD-2024-001',
      date: '2024-06-15',
      status: 'delivered',
      total: 89.99,
      items: 3,
      trackingNumber: '1Z999AA1234567890'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-06-10',
      status: 'shipped',
      total: 156.75,
      items: 2,
      trackingNumber: '1Z999AA1234567891'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-06-08',
      status: 'processing',
      total: 234.5,
      items: 5,
      trackingNumber: null
    },
    {
      id: 'ORD-2024-004',
      date: '2024-06-05',
      status: 'cancelled',
      total: 67.25,
      items: 1,
      trackingNumber: null
    }
  ],

  // Wishlist Items
  wishlistItems: [
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      price: 129.99,
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
      inStock: true
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      price: 199.99,
      image:
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
      inStock: true
    },
    {
      id: 3,
      name: 'Portable Coffee Maker',
      price: 79.99,
      image:
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=100&h=100&fit=crop',
      inStock: false
    }
  ],

  // Payment Methods
  paymentMethods: [
    {
      id: 1,
      type: 'credit',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/26',
      isDefault: true
    },
    {
      id: 2,
      type: 'credit',
      brand: 'Mastercard',
      last4: '8888',
      expiry: '08/25',
      isDefault: false
    }
  ]
};

const EcommerceProfilePage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center md:items-start">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage
                    src={mockUserData.avatar}
                    alt={`${mockUserData.firstName} ${mockUserData.lastName}`}
                  />
                  <AvatarFallback className="text-xl">
                    {getInitials(mockUserData.firstName, mockUserData.lastName)}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="secondary" className="mb-2">
                  <Gift className="w-3 h-3 mr-1" />
                  {mockUserData.membershipTier} Member
                </Badge>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold">
                    {mockUserData.firstName} {mockUserData.lastName}
                  </h1>
                  <p className="">{mockUserData.email}</p>
                  <p className="text-sm">
                    Member since {formatDate(mockUserData.memberSince)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">
                {mockUserData.stats.totalOrders}
              </div>
              <div className="text-sm">Total Orders</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">
                ${mockUserData.stats.totalSpent}
              </div>
              <div className="text-sm">Total Spent</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Heart className="w-8 h-8 mx-auto mb-2 text-red-600" />
              <div className="text-2xl font-bold text-red-600">
                {mockUserData.stats.wishlistItems}
              </div>
              <div className="text-sm">Wishlist Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">
                {mockUserData.stats.loyaltyPoints}
              </div>
              <div className="text-sm">Loyalty Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserData.recentOrders.slice(0, 3).map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(order.date)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${order.total}</p>
                          <Badge
                            className={`text-xs ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Addresses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserData.addresses.map((address) => (
                      <div key={address.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{address.type}</h4>
                          {address.isDefault && (
                            <Badge variant="secondary">Default</Badge>
                          )}
                        </div>
                        <p className="text-sm">
                          {address.street}
                          <br />
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserData.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(order.status)}
                        <div>
                          <p className="font-semibold">{order.id}</p>
                          <p className="text-sm">
                            {formatDate(order.date)} • {order.items} items
                          </p>
                          {order.trackingNumber && (
                            <p className="text-xs">
                              Tracking: {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <Badge
                          className={`text-xs ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {mockUserData.wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.name}</h4>
                        <p className="text-lg font-bold text-green-600">
                          ${item.price}
                        </p>
                        <p
                          className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" disabled={!item.inStock}>
                          Add to Cart
                        </Button>
                        <Button variant="outline" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockUserData.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5" />
                          <div>
                            <p className="font-semibold">
                              {method.brand} •••• {method.last4}
                            </p>
                            <p className="text-sm">Expires {method.expiry}</p>
                          </div>
                        </div>
                        {method.isDefault && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" className="w-full">
                      Add Payment Method
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Bell className="w-4 h-4 mr-2" />
                      Notification Preferences
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Privacy Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <User className="w-4 h-4 mr-2" />
                      Personal Information
                    </Button>
                    <Separator />
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EcommerceProfilePage;
