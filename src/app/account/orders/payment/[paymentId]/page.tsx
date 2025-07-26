'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, Hash, CreditCard, Calendar, Building2, Home, ArrowRight } from 'lucide-react';

// Mock data based on your JSON structure
const mockData = {
  data: {
    id: "0b40ec02-3148-4195-a15a-6e73f78e7c74",
    orderId: 90142638,
    vnpTxnRef: "90142638",
    vnpTransactionNo: "15100692",
    amount: 219000000.00,
    bankCode: "NCB",
    cardType: "ATM",
    payDate: null,
    responseCode: "00",
    transactionStatus: "00",
    paymentStatus: null
  },
  success: true,
  executeDate: "2025-07-26T10:53:52.451",
  httpStatus: 200,
  requestId: "411df173-e7db-4198-b993-7c28fc3436d2"
};

const PaymentResult = () => {
  const [data] = useState(mockData);
  
  const paymentData = data.data;
  const isSuccess = data.success && paymentData.responseCode === "00";

  const formatAmount = (amount: number) => {
    // Amount is already in VND, no need to divide by 100
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    
    // Handle ISO date format
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
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

  if (!data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg border">
          {/* Header */}
          <div className="px-6 py-8 text-center border-b">
            <div className="flex justify-center mb-4">
              {isSuccess ? (
                <CheckCircle className="h-16 w-16 text-green-500" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500" />
              )}
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
              {isSuccess ? 'Thanh toán thành công!' : 'Thanh toán thất bại!'}
            </h1>
            <p className="text-lg text-gray-600">
              {getResponseMessage(paymentData.responseCode)}
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Mã đơn hàng:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {paymentData.orderId}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Số tiền:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6 font-semibold">
                  {formatAmount(paymentData.amount)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Thời gian:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {formatDate(data.executeDate)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-gray-500" />
                  <span className="font-medium">Ngân hàng:</span>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  {getBankName(paymentData.bankCode)}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Mã giao dịch VNPay:</span>
                  <p className="text-gray-600">
                    {paymentData.vnpTxnRef}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Mã giao dịch ngân hàng:</span>
                  <p className="text-gray-600">{paymentData.vnpTransactionNo}</p>
                </div>
                <div>
                  <span className="font-medium">Loại thẻ:</span>
                  <p className="text-gray-600">{paymentData.cardType}</p>
                </div>
                <div>
                  <span className="font-medium">Trạng thái:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    isSuccess 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isSuccess ? 'Thành công' : 'Thất bại'}
                  </span>
                </div>
              </div>

              <div className="text-sm">
                <span className="font-medium">Request ID:</span>
                <p className="text-gray-600 text-xs mt-1 font-mono">
                  {data.requestId}
                </p>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => (window.location.href = '/orders')}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Hash className="h-4 w-4 mr-2" />
                Xem đơn hàng
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </button>
              {!isSuccess && (
                <button
                  onClick={() => (window.location.href = '/checkout')}
                  className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Thử lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
