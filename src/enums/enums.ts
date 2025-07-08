export enum ApiEnum {
  API_V1 = '/api/v1',
  API_V2 = '/api/v2'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum RouteEnum {
  DETAIL = '/detail',
  PRODUCTS = '/products'
}

export enum SortOption {
  A_TO_Z = 'asc',
  Z_TO_A = 'desc',
  PRICE_LOW_TO_HIGH = 'priceAsc',
  PRICE_HIGH_TO_LOW = 'priceDesc'
}

export enum SideBarTypeEnum {
  ACCOUNT_INFO = 'ACCOUNT_INFO',
  ADDRESS = 'ADDRESS',
  MANAGE_ORDER = 'MANAGE_ORDER',
  WISHLIST = 'WISHLIST',
  VIEW_HISTORY = 'VIEW_HISTORY',
  LOGOUT = 'LOGOUT'
}

export enum TabProfileEnum {
  ADDRESS = 'address',
  LOGOUT = 'logout',
  VIEW_HISTORY = 'view-history',
  MANAGE_ORDER = 'manage-order',
  ACCOUNT_INFO = 'account-info'
}

export enum ErrorMessage {
    NETWORK_ERROR = 'Network Error',
}
