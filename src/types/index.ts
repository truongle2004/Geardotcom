export interface ApiResponse<T> {
  success: boolean;
  data: T;
  executeDate: string;
  httpStatus: number;
}

export interface PaginatedResponse<T> {
  content: T;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  currentPage: number;
}

export interface CartItemType {
  id: string;
  inStock: boolean;
  productTitle: string;
  productId: string;
  handle: string;
  price: number;
  quantity: number;
  imageSrc: string;
  imageAlt: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  purchaseCount: number;
  description: string;
  averageRating: number;
  reviewCount: number;
  price: number;
  tags: string;
  productImage: string;
  imageAlt: string;
  images: ProductImage[];
  available: boolean;
  soleQuantity: number;
}

export interface ProductDetail extends Product {
  images: ProductImage[];
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
  position: number;
}

export interface Category {
  id: number;
  name: string;
  handle: string;
  description: string;
}

export interface KeycloakTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
}

export interface UserInfo {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  email_verified?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  handle: string;
  description: string;
}

interface BaseAddress {
  id: number;
  code: number;
  name: string;
  codename: string;
  divisionType: string;
  shortCodeName: string;
}

export interface District extends BaseAddress {
  provinceCode: number;
}

export interface Ward extends BaseAddress {
  districtCode: number;
}

export interface Message {
  id: number;
  variant: 'sent' | 'received';
  avatar: string;
  message: string;
  timestamp: Date;
}

export interface Province extends BaseAddress {}

export interface PaginatedSelectProps {
  placeholder: string;
  value: string;
  onValueChange: (value: string, item: any) => void;
  data: any[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export interface UserAddressRequest {
  id?: string;
  receiverName: string;
  phoneNumber: string;
  fullAddress: string;
  provinceCode: number;
  districtCode: number;
  wardCode: number;
  addressType: string;
}

export interface UserAddressResponse {
  id?: string;
  receiverName: string;
  phoneNumber: string;
  fullAddress: string;
  province: string;
  district: string;
  ward: string;
  addressType: string;
}

export interface PaymentRepsonse {
  status: string;
  message: string;
  url: string;
}

export interface PaymentParamResponse {
    id: string;
    orderId: string;
    vnpTxnRef: string;
    vnpTransactionNo: string;
    amount: string;
    bankCode: string;
    cardType: string;
    payDate: string;
    responseCode: string;
    transactionStatus: string;
    paymentStatus: string;
}

export interface PaymentParams {
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
