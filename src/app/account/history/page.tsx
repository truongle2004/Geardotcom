'use client';

import React, { useState, useMemo } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Calendar,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

// Types
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

// Mock data
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    date: '2024-06-15',
    status: 'delivered',
    total: 129.99,
    items: [
      {
        id: '1',
        name: 'Wireless Bluetooth Headphones',
        quantity: 1,
        price: 79.99
      },
      { id: '2', name: 'Phone Case', quantity: 2, price: 25.0 }
    ],
    shippingAddress: '123 Main St, City, State 12345',
    trackingNumber: 'TRK123456789'
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    date: '2024-06-10',
    status: 'shipped',
    total: 89.99,
    items: [{ id: '3', name: 'Smart Watch', quantity: 1, price: 89.99 }],
    shippingAddress: '456 Oak Ave, City, State 12345',
    trackingNumber: 'TRK987654321'
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    date: '2024-06-05',
    status: 'processing',
    total: 199.99,
    items: [
      { id: '4', name: 'Laptop Stand', quantity: 1, price: 49.99 },
      { id: '5', name: 'USB-C Hub', quantity: 1, price: 79.99 },
      { id: '6', name: 'Wireless Mouse', quantity: 1, price: 70.01 }
    ],
    shippingAddress: '789 Pine St, City, State 12345'
  },
  {
    id: '4',
    orderNumber: 'ORD-2024-004',
    date: '2024-05-28',
    status: 'cancelled',
    total: 45.99,
    items: [{ id: '7', name: 'Screen Cleaner Kit', quantity: 1, price: 45.99 }],
    shippingAddress: '321 Elm St, City, State 12345'
  }
];

const OrderHistoryPage: React.FC = () => {
  const [orders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  // Get status icon and color
  const getStatusConfig = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'Pending'
        };
      case 'processing':
        return {
          icon: Package,
          color: 'bg-blue-100 text-blue-800',
          label: 'Processing'
        };
      case 'shipped':
        return {
          icon: Truck,
          color: 'bg-purple-100 text-purple-800',
          label: 'Shipped'
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'Delivered'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800',
          label: 'Cancelled'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800',
          label: 'Unknown'
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Lịch sử đơn hàng</h1>
        <p>Theo dõi và quản lý các đơn hàng gần đây của bạn</p>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả đơn hàng</SelectItem>
                  <SelectItem value="pending">Đang chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="shipped">Đã gửi hàng</SelectItem>
                  <SelectItem value="delivered">Đã giao hàng</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Đơn hàng của bạn ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy đơn hàng nào
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Không có đơn hàng nào khớp với bộ lọc hiện tại của bạn'
                  : 'Bạn chưa đặt đơn hàng nào'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead>Ngày đặt</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <TableRow key={order.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.orderNumber}
                            </div>
                            {order.trackingNumber && (
                              <div className="text-sm text-gray-500">
                                Mã vận đơn: {order.trackingNumber}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(order.date)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.items.length} sản phẩm
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.items[0]?.name}
                              {order.items.length > 1 &&
                                ` +${order.items.length - 1} sản phẩm khác`}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  Xem
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>
                                    Chi tiết đơn hàng - {order.orderNumber}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Đơn hàng được đặt vào{' '}
                                    {formatDate(order.date)}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedOrder && (
                                  <div className="space-y-6">
                                    {/* Order Status */}
                                    <div className="flex items-center gap-3">
                                      <StatusIcon className="h-5 w-5" />
                                      <span className="font-medium">
                                        {statusConfig.label}
                                      </span>
                                      {selectedOrder.trackingNumber && (
                                        <Badge variant="outline">
                                          Mã vận đơn:{' '}
                                          {selectedOrder.trackingNumber}
                                        </Badge>
                                      )}
                                    </div>

                                    {/* Items */}
                                    <div>
                                      <h4 className="font-medium mb-3">
                                        Các sản phẩm đã đặt
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedOrder.items.map((item) => (
                                          <div
                                            key={item.id}
                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                          >
                                            <div>
                                              <div className="font-medium">
                                                {item.name}
                                              </div>
                                              <div className="text-sm text-gray-500">
                                                Số lượng: {item.quantity}
                                              </div>
                                            </div>
                                            <div className="font-medium">
                                              {formatCurrency(item.price)}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                      <h4 className="font-medium mb-2">
                                        Địa chỉ giao hàng
                                      </h4>
                                      <p className="text-gray-600">
                                        {selectedOrder.shippingAddress}
                                      </p>
                                    </div>

                                    {/* Order Total */}
                                    <div className="border-t pt-4">
                                      <div className="flex justify-between items-center text-lg font-semibold">
                                        <span>Tổng tiền</span>
                                        <span>
                                          {formatCurrency(selectedOrder.total)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Đặt lại
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderHistoryPage;
