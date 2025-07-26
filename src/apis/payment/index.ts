import { ApiEnum } from '@/enums/enums';
import { ApiResponse, PaymentParamResponse } from '@/types';
import axiosInstance from '@/utils/axiosInstance';

export const paymentReturnAPI = (
  paymentId: string
): Promise<ApiResponse<PaymentParamResponse>> => {
  return axiosInstance.get(`${ApiEnum.API_V1}/payment/vnpay_return/${paymentId}`);
};

export const paymentSucessAPI = (
  params: string
): Promise<ApiResponse<string>> => {
  return axiosInstance.get(
    `${ApiEnum.API_V1}/payment/handle_success?${params}`
  );
};
