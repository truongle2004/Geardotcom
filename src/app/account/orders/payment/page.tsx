'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  CheckCircle,
  XCircle,
  CreditCard,
  Calendar,
  Hash,
  Building2,
  ArrowRight,
  Home
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PaymentParams {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
}

const PaymentResult = () => {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentParams | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  useEffect(() => {
    const params: PaymentParams = {
      vnp_Amount: searchParams.get('vnp_Amount') || '',
      vnp_BankCode: searchParams.get('vnp_BankCode') || '',
      vnp_BankTranNo: searchParams.get('vnp_BankTranNo') || '',
      vnp_CardType: searchParams.get('vnp_CardType') || '',
      vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
      vnp_PayDate: searchParams.get('vnp_PayDate') || '',
      vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
      vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
      vnp_TransactionNo: searchParams.get('vnp_TransactionNo') || '',
      vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus') || '',
      vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
      vnp_SecureHash: searchParams.get('vnp_SecureHash') || ''
    };

    setPaymentData(params);
    // Check if payment is successful (ResponseCode "00" means success)
    setIsSuccess(
      params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00'
    );
  }, [searchParams]);

  const formatAmount = (amount: string) => {
    const numAmount = parseInt(amount) / 100; // VNPay returns amount in cents
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString.length !== 14) return 'N/A';

    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  const decodeOrderInfo = (orderInfo: string) => {
    return decodeURIComponent(orderInfo.replace(/\+/g, ' '));
  };

  const getBankName = (bankCode: string) => {
    const bankMap: { [key: string]: string } = {
      NCB: 'Ngân hàng Quốc Dân',
      VCB: 'Ngân hàng Vietcombank',
      VTB: 'Ngân hàng Vietinbank',
      BIDV: 'Ngân hàng BIDV',
      TPB: 'Ngân hàng Tiên Phong',
      MB: 'Ngân hàng MB',
      TCB: 'Ngân hàng Techcombank',
      ACB: 'Ngân hàng ACB',
      SHB: 'Ngân hàng SHB',
      EXB: 'Ngân hàng Eximbank'
    };
    return bankMap[bankCode] || bankCode;
  };

  const getResponseMessage = (responseCode: string) => {
    const responseMap: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
      '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
    };
    return responseMap[responseCode] || 'Lỗi không xác định';
  };

  if (!paymentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <CardTitle
              className={`text-2xl font-bold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
            >
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
            </CardTitle>
            <CardDescription className="text-lg">
              {getResponseMessage(paymentData.vnp_ResponseCode)}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Mã đơn hàng:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {paymentData.vnp_TxnRef}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Số tiền:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6 font-semibold">
                  {formatAmount(paymentData.vnp_Amount)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Thời gian:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {formatDate(paymentData.vnp_PayDate)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ngân hàng:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {getBankName(paymentData.vnp_BankCode)}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <span className="font-medium">Thông tin đơn hàng:</span>
                <p className="text-sm text-gray-600 mt-1">
                  {decodeOrderInfo(paymentData.vnp_OrderInfo)}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Mã giao dịch:</span>
                  <p className="text-gray-600">
                    {paymentData.vnp_TransactionNo}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Mã giao dịch ngân hàng:</span>
                  <p className="text-gray-600">{paymentData.vnp_BankTranNo}</p>
                </div>
                <div>
                  <span className="font-medium">Loại thẻ:</span>
                  <p className="text-gray-600">{paymentData.vnp_CardType}</p>
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>
                  <Badge
                    variant={isSuccess ? 'default' : 'destructive'}
                    className="ml-2"
                  >
                    {isSuccess ? 'Thành công' : 'Thất bại'}
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => (window.location.href = '/orders')}
                className="flex-1"
                variant={isSuccess ? 'default' : 'outline'}
              >
                <Hash className="h-4 w-4 mr-2" />
                Xem đơn hàng
              </Button>
              <Button
                onClick={() => (window.location.href = '/')}
                variant="outline"
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Button>
              {!isSuccess && (
                <Button
                  onClick={() => (window.location.href = '/checkout')}
                  className="flex-1"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Thử lại
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentResult;
