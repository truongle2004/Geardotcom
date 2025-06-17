import { CartItemType } from '@/types';
import { create } from 'zustand';

interface CartStore {
  cartItems: Map<CartItemType, boolean>;
  isSelectedAllCartItem: boolean;
  setIsSelectedAllCartItem: (value: boolean) => void;
}

const useCartStore = create<CartStore>((set) => ({
  cartItems: new Map<CartItemType, boolean>(),
  isSelectedAllCartItem: false,
  setIsSelectedAllCartItem: (value: boolean) =>
    set({ isSelectedAllCartItem: value })
}));

export default useCartStore;
