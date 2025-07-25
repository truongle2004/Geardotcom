'use client';
import { type CartItemType } from '@/types';
import { Heart, Minus, Package, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { FC, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { convertVND } from '@/utils/vnd';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/enums/enums';
import Link from 'next/link';

interface CartItemProps {
  cartItem: CartItemType;
  isSelected: boolean;
  isPendingDelete: boolean;
  selectedQuantity: number;
  handleSelectCart: (id: string, isChecked: boolean, quantity: number) => void;
  handleDeleteItem: (id: string) => void;
  handleAddProductToWishlist: (productId: string) => void;
  handleQuantityChange: (id: string, quantity: number) => void;
}

const CartItem: FC<CartItemProps> = ({
  cartItem,
  isSelected,
  isPendingDelete: isLoadingDelete,
  selectedQuantity,
  handleDeleteItem,
  handleSelectCart,
  handleAddProductToWishlist,
  handleQuantityChange
}) => {
  const [quantity, setQuantity] = useState(cartItem?.quantity || 1);

  const handleCheckboxChange = () => {
    handleSelectCart(cartItem.id, !isSelected, quantity);
  };

  const handleQuantityChangeLocal = async (newQuantity: number) => {
    if (newQuantity < 1) return;

    setQuantity(newQuantity);

    // Update the selected quantity if this item is selected
    if (isSelected) {
      handleQuantityChange(cartItem.id, newQuantity);
    }
  };

  const incrementQuantity = () => handleQuantityChangeLocal(quantity + 1);
  const decrementQuantity = () => handleQuantityChangeLocal(quantity - 1);

  // Use selectedQuantity for calculation if item is selected, otherwise use local quantity
  const displayQuantity = isSelected ? selectedQuantity : quantity;
  const totalPrice = (cartItem?.price || 0) * displayQuantity;

  return (
    <Card
      className={`w-full transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary ring-opacity-50 shadow-md' : ''
      }`}
    >
      <CardContent className="p-0">
        <div className="flex">
          {/* Selection Checkbox */}
          <div className="flex items-center p-4 border-r">
            <Checkbox
              onClick={handleCheckboxChange}
              checked={isSelected}
              className="h-5 w-5"
            />
          </div>

          {/* Product Content */}
          <div className="flex-1 p-4 md:p-6">
            <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
              {/* Product Image */}
              <div className="shrink-0 md:order-1">
                {cartItem?.imageSrc ? (
                  <div className="relative">
                    <Image
                      className="h-24 w-24 rounded-lg object-cover border"
                      width={96}
                      height={96}
                      src={cartItem?.imageSrc}
                      alt={
                        cartItem?.imageAlt ||
                        cartItem?.productTitle ||
                        'Product image'
                      }
                    />
                    {cartItem?.inStock === false && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 text-xs"
                      >
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center border">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="w-full min-w-0 flex-1 space-y-3 md:order-2 md:max-w-md">
                <div>
                  <Link
                    href={`${RouteEnum.DETAIL}/${cartItem?.productId}/${cartItem.handle}`}
                  >
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 leading-tight cursor-pointer hover:text-blue-600">
                      {cartItem?.productTitle}
                    </h3>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-medium text-primary">
                      {convertVND(cartItem?.price)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 p-0 h-auto font-normal"
                    onClick={() =>
                      handleAddProductToWishlist(cartItem.productId)
                    }
                  >
                    <Heart className="mr-1.5 h-4 w-4" />
                    Lưu vào yêu thích
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-red-600 p-0 h-auto font-normal"
                    onClick={() => handleDeleteItem(cartItem.id)}
                    disabled={isLoadingDelete}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" />
                    Xóa
                  </Button>
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="flex items-center justify-between md:order-3 md:flex-col md:items-end md:space-y-4">
                {/* Quantity Controls */}
                <div className="flex items-center">
                  <div className="flex items-center border rounded-lg bg-white dark:bg-gray-800">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={decrementQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="w-16 text-center">
                      <Input
                        type="number"
                        value={displayQuantity}
                        onChange={(e) => {
                          const newVal = parseInt(e.target.value) || 1;
                          handleQuantityChangeLocal(newVal);
                        }}
                        className="border-0 text-center focus-visible:ring-0 h-9 text-sm font-medium"
                        min="1"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {convertVND(totalPrice)}
                  </p>
                  {displayQuantity > 1 && (
                    <p className="text-sm text-gray-500">
                      {convertVND(cartItem?.price)} each
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CartItem;
