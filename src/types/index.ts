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
}

export interface CartItemType {
  id: string;
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
}

export interface Vendor {
  id: string;
  name: string;
  handle: string;
  description: string;
}
