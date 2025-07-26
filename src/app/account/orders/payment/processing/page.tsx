'use client';

import { paymentSucessAPI } from '@/apis/payment';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Alert } from '@/components/ui/alert';
import useUserStore from '@/store/userStore';
import { useQuery } from '@tanstack/react-query';
import { HttpStatusCode } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ProcessingPaymentPage = () => {
  const searchParams = useSearchParams();
  const { userInfo } = useUserStore();
  const router = useRouter();

  const params: Record<string, string> = {
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

  const queryString = new URLSearchParams(params).toString();

  const { data, isPending, isError, isSuccess, isLoading } = useQuery({
    queryKey: ['payment', queryString],
    queryFn: () => paymentSucessAPI(queryString),
    enabled: !!queryString && !!userInfo && !!userInfo.sub,
    retry: false
  });

  useEffect(() => {
    if (
      data?.httpStatus === HttpStatusCode.Ok &&
      data.data !== null &&
      data.data !== ''
    ) {
      router.push(`/account/orders/payment/${data.data}`);
    }
  }, [data, isSuccess]);

  return (
    <div className="min-h-screen">
      {(isPending || isLoading) && <LoadingOverlay />}
      {(isError || data?.httpStatus !== HttpStatusCode.Ok) && (
        <p>Something went wrong!</p>
      )}
    </div>
  );
};

export default ProcessingPaymentPage;
